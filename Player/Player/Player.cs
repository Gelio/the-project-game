using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.Common;
using System.Linq;
using Player.Messages.Responses;
using Player.Messages.Requests;
using Player.GameObjects;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Player
{
    public class Player
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public string Id;
        public int TeamId;
        public bool IsLeader;
        public string GameName;
        public int AskLevel;
        public int RespondLevel;
        public int Timeout;
        public int X;
        public int Y;
        public string ServerHostName => _communicator.ServerHostName;
        public int ServerPort => _communicator.ServerPort;
        public IList<string> TeamMembersIds;
        public string LeaderId;
        public GameInfo Game;
        public List<Tile> Board = new List<Tile>();
        public Piece HeldPiece;
        private ICommunicator _communicator;
        private IGameService _gameService;
        public bool IsConnected => _communicator.IsConnected;

        public Player(ICommunicator communicator, PlayerConfig config, IGameService gameService)
        {
            _communicator = communicator;
            _gameService = gameService;

            Id = Guid.NewGuid().ToString();
            TeamId = config.TeamNumber;
            IsLeader = config.IsLeader;
            AskLevel = config.AskLevel;
            RespondLevel = config.RespondLevel;
            Timeout = config.Timeout;
            GameName = config.GameName;
        }

        public void Start()
        {
            GetGameInfo();
            ConnectToServer();
            WaitForGameStart();
            RefreshBoardState(); // -- gives us info about all teammates' (+ ours) initial position
            logger.Debug($"Player's init position: {X} {Y}");
            Play();
        }

        public void GetGameInfo()
        {
            var gamesList = _gameService.GetGamesList();
            Game = gamesList.FirstOrDefault(x => x.Name == GameName);
            if (Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }

            for (int i = 0; i < Game.BoardSize.X * (Game.BoardSize.GoalArea * 2 + Game.BoardSize.TaskArea); i++)
            {
                Board.Add(new Tile());
            }
        }

        public void ConnectToServer()
        {
            if (!_communicator.IsConnected)
            {
                _communicator.Connect();
            }

            var helloMessage = new Message<PlayerHelloPayload>
            {
                Type = Consts.PlayerHelloRequest,
                SenderId = Id,
                Payload = new PlayerHelloPayload
                {
                    Game = GameName,
                    TeamId = TeamId,
                    IsLeader = IsLeader,
                }
            };
            var helloMessageSerialized = JsonConvert.SerializeObject(helloMessage);
            _communicator.Send(helloMessageSerialized);


            Task<string> receivedMessageSerializedTask;
            try
            {
                receivedMessageSerializedTask = Task.Run(() => _communicator.Receive());
                if (!receivedMessageSerializedTask.Wait(Timeout))
                    throw new TimeoutException($"Did not receive any message after {Timeout}ms");
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
            }
            var receivedMessageSerialized = receivedMessageSerializedTask.Result;

            var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);
            if (receivedGenericMessage.Type == Consts.PlayerRejected)
            {
                var rejectedMessage = JsonConvert.DeserializeObject<Message<PlayerRejectedPayload>>(receivedMessageSerialized);
                throw new PlayerRejectedException(rejectedMessage.Payload.Reason);
            }

            var acceptedMessage = JsonConvert.DeserializeObject<Message<PlayerAcceptedPayload>>(receivedMessageSerialized);
            logger.Info("Player connected to server");
        }

        public void Disconnect()
        {
            _communicator.Disconnect();
            logger.Info("Player disconnected.");
        }
        public void WaitForGameStart()
        {
            string receivedMessageSerialized;
            while (true)
            {
                receivedMessageSerialized = _communicator.Receive();

                var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);

                if (receivedGenericMessage.Type == Consts.GameStarted) break;
            }

            var message = JsonConvert.DeserializeObject<Message<GameStartedPayload>>(receivedMessageSerialized);

            TeamMembersIds = message.Payload.TeamInfo[TeamId].Players;
            LeaderId = message.Payload.TeamInfo[TeamId].LeaderId;
            logger.Info("The game has started!");
        }

        public void Play()
        {
            while (true)
            {
                RefreshBoardState();
                logger.Debug("Player's position: {} {}", X, Y);
                if (HeldPiece != null)
                {
                    if (IsInGoalArea())
                    {
                        logger.Info("Trying to place down piece");
                        (var result, var resultEnum) = PlaceDownPiece();
                        string direction = PickMovementDirection();
                        Move(direction);
                    }
                    else
                        Move("up");
                }
                else
                {
                    if (Board[GetBoardIndex()].DistanceToClosestPiece == 0)
                    {
                        logger.Info("Trying to pick up piece...");
                        PickUpPiece();
                        continue;
                    }

                    string direction = PickMovementDirection();
                    Move(direction);
                }
            }
        }

        private string PickMovementDirection()
        {
            string[] directions = { "up", "down", "left", "right" };
            return directions[new Random().Next(0, 4)];
        }

        private int GetBoardIndex() => X + Game.BoardSize.X * Y;
        private bool IsInGoalArea() => (Y < Game.BoardSize.GoalArea || Y >= Game.BoardSize.GoalArea + Game.BoardSize.TaskArea);
        public bool Discover()
        {
            var message = new Message<DiscoveryPayload>()
            {
                Type = Consts.DiscoveryRequest,
                RecipientId = Consts.GameMasterId,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                throw new GameAlreadyFinishedException("Action will not be performed. Game has already ended.");

            if (receivedRaw.Type != Consts.DiscoveryResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.DiscoveryResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<DiscoveryResponsePayload>>(receivedSerialized);

            if (received.Payload == null)
                throw new NoPayloadException();

            if (received.Payload.Tiles == null)
                throw new WrongPayloadException();

            foreach (var tileDTO in received.Payload.Tiles)
            {
                Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y] = AutoMapper.Mapper.Map<Tile>(tileDTO);
                Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y].Timestamp = received.Payload.Timestamp;
                if (tileDTO.Piece)
                {
                    Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y].Piece = new Piece();
                }
            }
            return true;
        }

        public bool GetActionStatus()
        {
            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.ActionValid)
            {
                var received = JsonConvert.DeserializeObject<Message<ActionValidPayload>>(receivedSerialized);
                return true;

            }
            if (receivedRaw.Type == Consts.ActionInvalid)
            {
                var received = JsonConvert.DeserializeObject<Message<ActionInvalidPayload>>(receivedSerialized);
                logger.Warn("ACTION INVALID: {0}", received.Payload.Reason);
                return false;
            }
            if (receivedRaw.Type == Consts.GameFinished)
            {
                GameAlreadyFinished(receivedSerialized);
            }

            throw new InvalidTypeReceivedException($"Expected: ACTION_VALID/INVALID Received: {receivedRaw.Type}");
        }

        public bool RefreshBoardState()
        {
            var message = new Message<RefreshStatePayload>()
            {
                Type = Consts.RefreshStateRequest,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.RefreshStateResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.RefreshStateResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<RefreshStateResponsePayload>>(receivedSerialized);
            if (received.Payload == null)
                throw new NoPayloadException();

            bool gotOwnInfo = false;
            if (received.Payload.PlayerPositions == null)
                throw new WrongPayloadException();
            foreach (var playerInfo in received.Payload.PlayerPositions)
            {
                Board[playerInfo.X + Game.BoardSize.X * playerInfo.Y].PlayerId = playerInfo.PlayerId;
                Board[playerInfo.X + Game.BoardSize.X * playerInfo.Y].Timestamp = received.Payload.Timestamp;
                if (playerInfo.PlayerId == Id)
                {
                    X = playerInfo.X;
                    Y = playerInfo.Y;
                    Board[GetBoardIndex()].DistanceToClosestPiece = received.Payload.CurrentPositionDistanceToClosestPiece;
                    gotOwnInfo = true;
                    if (Board[GetBoardIndex()].Piece == null && Board[GetBoardIndex()].DistanceToClosestPiece == 0)
                        Board[GetBoardIndex()].Piece = new Piece();
                }
            }

            if (!gotOwnInfo)
                throw new InvalidOperationException("No info about player");
            return true;
        }

        public bool Move(string direction)
        {
            int newX = X;
            int newY = Y;
            switch (direction)
            {
                case "up":
                    newY -= 1;
                    break;
                case "down":
                    newY += 1;
                    break;
                case "left":
                    newX += 1;
                    break;
                case "right":
                    newX -= 1;
                    break;
                default:
                    return false;
            }
            int index = newX + Game.BoardSize.X * newY;
            var message = new Message<MovePayload>()
            {
                Type = Consts.MoveRequest,
                SenderId = Id,
                Payload = new MovePayload
                {
                    Direction = direction
                }
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.MoveResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.MoveResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<MoveResponsePayload>>(receivedSerialized);
            if (received.Payload == null)
                throw new NoPayloadException();

            Board[X + Game.BoardSize.X * Y].PlayerId = null;
            Board[index].PlayerId = Id;
            Board[index].DistanceToClosestPiece = received.Payload.DistanceToPiece;
            Board[index].Timestamp = received.Payload.TimeStamp;
            X = newX;
            Y = newY;
            return true;
        }

        public bool PickUpPiece()
        {
            var message = new Message<PickUpPiecePayload>
            {
                Type = Consts.PickupPieceRequest,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.PickupPieceResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.PickupPieceResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<PickUpPieceResponsePayload>>(receivedSerialized);
            // if (received.Payload == null)
            //     throw new NoPayloadException();

            HeldPiece = Board[X + Game.BoardSize.X * Y].Piece;
            Board[X + Game.BoardSize.X * Y].Piece = null;

            logger.Info("Picked up piece @ ({}, {})", X, Y);
            return true;
        }

        public (bool, PlaceDownPieceResult) PlaceDownPiece()
        {
            var message = new Message<PlaceDownPiecePayload>
            {
                Type = Consts.PlaceDownPieceRequest,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return (false, PlaceDownPieceResult.NoScore); }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.PlaceDownPieceResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.PlaceDownPieceResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<PlaceDownPieceResponsePayload>>(receivedSerialized);
            if (received.Payload == null)
                throw new NoPayloadException();

            Board[X + Game.BoardSize.X * Y].Piece = HeldPiece;
            HeldPiece = null;
            if (!received.Payload.DidCompleteGoal.HasValue
                 && (Y < Game.BoardSize.GoalArea
                || Y >= Game.BoardSize.GoalArea + Game.BoardSize.TaskArea))
            {
                Board[X + Game.BoardSize.X * Y].Piece.HasInfo = true;
                Board[X + Game.BoardSize.X * Y].Piece.IsSham = true;
                logger.Info("The piece was a sham!");
                return (true, PlaceDownPieceResult.Sham);
            }
            else if (!received.Payload.DidCompleteGoal.HasValue)
            {
                logger.Info("Placed a piece in Task Area");
                return (true, PlaceDownPieceResult.TaskArea);
            }
            else if (!received.Payload.DidCompleteGoal.Value)
            {
                logger.Info("This tile is not a goal tile");
                return (true, PlaceDownPieceResult.NoScore);
            }
            else
            {
                logger.Info($"Got 1 point for placing a piece @ {X} {Y}!");
                return (true, PlaceDownPieceResult.Score);
            }

        }
        public enum PlaceDownPieceResult
        {
            Sham = -1,
            NoScore = 0,
            Score = 1,
            TaskArea = 2
        }

        public void GameAlreadyFinished(string receivedMessageSerialized)
        {
            var received = JsonConvert.DeserializeObject<Message<GameFinishedPayload>>(receivedMessageSerialized);
            var winnerTeam = (received.Payload.Team1Score > received.Payload.Team2Score) ? received.Payload.Team1Score : received.Payload.Team2Score;
            string message = $"Cannot perform the planned action. Game has already finished.\n" +
                $"Scores:\n\tTeam1: {received.Payload.Team1Score}\n\tTeam2: {received.Payload.Team2Score}\n" +
                $"Congratulations {winnerTeam}! WOOP WOOP!\n";

            throw new GameAlreadyFinishedException(message);
        }
    }
}
