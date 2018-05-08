using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Requests;
using Player.Messages.Responses;

namespace Player
{
    public class Player
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public string Id;
        public IList<string> TeamMembersIds;
        public string LeaderId;

        public int X;
        public int Y;
        public List<Tile> Board = new List<Tile>();
        public Piece HeldPiece;
        public string GoalAreaDirection;
        public GameInfo Game;

        // TODO: Remove ICommunicator dependency
        private ICommunicator _communicator;
        private IGameService _gameService;
        private MessageProvider _messageProvider;
        private PlayerConfig _playerConfig;

        public Player(ICommunicator communicator, PlayerConfig playerConfig, IGameService gameService, MessageProvider messageProvider)
        {
            _communicator = communicator;
            _gameService = gameService;
            _messageProvider = messageProvider;
            _playerConfig = playerConfig;
            Id = Guid.NewGuid().ToString();
        }

        public void Start()
        {
            GetGameInfo();
            ConnectToServer();
            WaitForGameStart();
            RefreshBoardState(); // -- gives us info about all teammates' (+ ours) initial position
            logger.Debug($"Player's init position: {X} {Y}");
            GoalAreaDirection = Y < Game.BoardSize.GoalArea ? Consts.Up : Consts.Down;
            Play();
        }

        public void GetGameInfo()
        {
            var gamesList = _gameService.GetGamesList();
            Game = gamesList.FirstOrDefault(x => x.Name == _playerConfig.GameName);
            if (Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }

            for (int i = 0; i < Game.BoardSize.X * (Game.BoardSize.GoalArea * 2 + Game.BoardSize.TaskArea); i++)
            {
                Board.Add(new Tile()
                {
                    DistanceToClosestPiece = int.MaxValue,
                    GoalStatus = GoalStatusEnum.NoInfo
                });
            }
        }

        public void ConnectToServer()
        {
            _messageProvider.SendMessage(new Message<IPayload>
            {
                Type = Consts.PlayerHelloRequest,
                SenderId = Id,
                Payload = new PlayerHelloPayload
                {
                    Game = _playerConfig.GameName,
                    TeamId = _playerConfig.TeamNumber,
                    IsLeader = _playerConfig.IsLeader,
                }
            });
            _messageProvider.AssertPlayerStatus(_playerConfig.Timeout);
            logger.Info("Player connected to server");
        }

        public void Disconnect()
        {
            _communicator.Disconnect();
            logger.Info("Player disconnected.");
        }
        public void WaitForGameStart()
        {
            Message<GameStartedPayload> message;
            while (true)
            {
                try
                {
                    message = _messageProvider.Receive<GameStartedPayload>();
                    break;
                }
                catch (WrongPayloadException)
                {
                    // suppress
                }
            }

            TeamMembersIds = message.Payload.TeamInfo[_playerConfig.TeamNumber].Players;
            TeamMembersIds.Remove(Id);
            LeaderId = message.Payload.TeamInfo[_playerConfig.TeamNumber].LeaderId;
            logger.Info("The game has started!");
        }

        public void Play()
        {
            PrintBoard();
            while (true)
            {
                Task.Delay(3000);
                RefreshBoardState();
                UpdateBoard();
                if (_messageProvider.HasPendingRequests)
                {
                    Discover();
                    var senderId = _messageProvider.GetPendingRequest().Payload.SenderPlayerId;
                    SendCommunicationResponse(senderId);
                }
                if (_playerConfig.IsLeader)
                    SendCommunicationRequest(TeamMembersIds.FirstOrDefault());

                // //logger.Debug("Player's position: {} {}", X, Y);
                // if (HeldPiece != null)
                // {
                //     if (IsInGoalArea() && Board[GetCurrentBoardIndex()].GoalStatus == GoalStatusEnum.NoInfo)
                //     {
                //         logger.Info("Trying to place down piece");
                //         (var result, var resultEnum) = PlaceDownPiece();
                //     }
                //     else
                //         Move(PickSweepingGoalAreaDirection());
                // }
                // else if (Board[GetCurrentBoardIndex()].DistanceToClosestPiece == 0) // We stand on a piece
                // {
                //     logger.Info("Trying to pick up piece...");
                //     PickUpPiece();
                //     continue;
                // }
                // else // Find a piece
                // {
                //     Discover();
                //     string direction = PickClosestPieceDirection();
                //     Move(direction);
                // }
            }
        }

        private string PickClosestPieceDirection()
        {
            int bestDistance = int.MaxValue;
            int bestDx = 0, bestDy = 0;
            for (int dy = -1; dy <= 1; dy++)
                for (int dx = -1; dx <= 1; dx++)
                {
                    if (X + dx < 0 || X + dx >= Game.BoardSize.X || Y + dy < 0 || Y + dy >= (Game.BoardSize.TaskArea + Game.BoardSize.GoalArea * 2))
                        continue;
                    int index = X + dx + Game.BoardSize.X * (Y + dy);
                    logger.Debug("dx: {}, dy: {}, index: {}", dx, dy, index);
                    if (Board[index].DistanceToClosestPiece < bestDistance)
                    {
                        bestDistance = Board[index].DistanceToClosestPiece;
                        bestDx = dx;
                        bestDy = dy;
                    }
                }
            if (bestDy == -1)
                return Consts.Up;
            if (bestDy == 1)
                return Consts.Down;
            if (bestDx == -1)
                return Consts.Left;
            if (bestDx == 1)
                return Consts.Right;
            return Consts.Up;
        }
        private string PickRandomMovementDirection()
        {
            string[] directions = { Consts.Up, Consts.Down, Consts.Left, Consts.Right };
            return directions[new Random().Next(0, 4)];
        }

        private string PickSweepingGoalAreaDirection()
        {
            int startX, startY, endX, endY, dy;
            startX = 0;
            endX = Game.BoardSize.X - 1;
            if (GoalAreaDirection == Consts.Up)
            {
                startY = Game.BoardSize.GoalArea - 1;
                endY = -1;
                dy = -1;
            }
            else
            {
                startY = Game.BoardSize.GoalArea + Game.BoardSize.TaskArea;
                endY = (Game.BoardSize.GoalArea * 2) + Game.BoardSize.TaskArea;
                dy = 1;
            }

            // Find first tile with no info, first searching on horizontal axis *closest* to task area.
            // Then change axis moving outward (towards horizontal edge of the board) each outer loop iteration
            for (int y = startY; y != endY; y += dy)
                for (int x = startX; x <= endX; x++)
                    if (Board[x + y * Game.BoardSize.X].GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        if (X - x > 0)
                            return Consts.Left;
                        if (X - x < 0)
                            return Consts.Right;
                        if (Y - y > 0)
                            return Consts.Up;
                        else
                            return Consts.Down;
                    }
            throw new InvalidOperationException("There seems to be no goal tiles left");
        }

        private int GetCurrentBoardIndex() => X + Game.BoardSize.X * Y;
        private bool IsInGoalArea() => (Y < Game.BoardSize.GoalArea || Y >= Game.BoardSize.GoalArea + Game.BoardSize.TaskArea);
        public bool Discover()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.DiscoveryRequest,
                RecipientId = Consts.GameMasterId,
                SenderId = Id,
                Payload = new DiscoveryPayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<DiscoveryResponsePayload>();

            if (received.Payload == null)
                throw new NoPayloadException();

            if (received.Payload.Tiles == null)
                throw new WrongPayloadException();

            foreach (var tileDTO in received.Payload.Tiles)
            {
                AutoMapper.Mapper.Map<TileDiscoveryDTO, Tile>(tileDTO, Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y]);
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
            try
            {
                _messageProvider.Receive<ActionValidPayload>();
                return true;
            }
            catch (ActionInvalidException e)
            {
                logger.Warn("ACTION INVALID: {0}", e.Message);
                return false;
            }
            catch (WrongPayloadException e)
            {
                throw new InvalidTypeReceivedException($"Expected: ACTION_VALID/INVALID Received: {e.Message}");
            }
        }

        public bool RefreshBoardState()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.RefreshStateRequest,
                SenderId = Id,
                Payload = new RefreshStatePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<RefreshStateResponsePayload>();

            // TODO: Check if still necessary
            if (received.Payload == null)
                throw new NoPayloadException();

            bool gotOwnInfo = false;
            if (received.Payload.PlayerPositions == null)
                throw new WrongPayloadException();
            foreach (var playerInfo in received.Payload.PlayerPositions)
            {
                // TODO: Remove all (outdated) PlayerId attributes from board tiles
                Board[playerInfo.X + Game.BoardSize.X * playerInfo.Y].PlayerId = playerInfo.PlayerId;
                Board[playerInfo.X + Game.BoardSize.X * playerInfo.Y].Timestamp = received.Payload.Timestamp;
                if (playerInfo.PlayerId == Id)
                {
                    X = playerInfo.X;
                    Y = playerInfo.Y;
                    Board[GetCurrentBoardIndex()].DistanceToClosestPiece = received.Payload.CurrentPositionDistanceToClosestPiece;
                    gotOwnInfo = true;
                    if (Board[GetCurrentBoardIndex()].Piece == null && Board[GetCurrentBoardIndex()].DistanceToClosestPiece == 0)
                        Board[GetCurrentBoardIndex()].Piece = new Piece();
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
                case Consts.Up:
                    newY -= 1;
                    break;
                case Consts.Down:
                    newY += 1;
                    break;
                case Consts.Left:
                    newX -= 1;
                    break;
                case Consts.Right:
                    newX += 1;
                    break;
                default:
                    return false;
            }
            int index = newX + Game.BoardSize.X * newY;
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.MoveRequest,
                SenderId = Id,
                Payload = new MovePayload
                {
                    Direction = direction
                }
            });
            if (!GetActionStatus()) { return false; }
            logger.Debug("Moving {}", direction);
            var received = _messageProvider.Receive<MoveResponsePayload>();

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
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.PickupPieceRequest,
                SenderId = Id,
                Payload = new PickUpPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<PickUpPieceResponsePayload>();
            // if (received.Payload == null)
            //     throw new NoPayloadException();

            HeldPiece = Board[X + Game.BoardSize.X * Y].Piece;
            Board[X + Game.BoardSize.X * Y].Piece = null;

            logger.Info("Picked up piece @ ({}, {})", X, Y);
            return true;
        }

        public (bool, PlaceDownPieceResult) PlaceDownPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.PlaceDownPieceRequest,
                SenderId = Id,
                Payload = new PlaceDownPiecePayload()
            });
            if (!GetActionStatus()) { return (false, PlaceDownPieceResult.NoScore); }
            var received = _messageProvider.Receive<PlaceDownPieceResponsePayload>();

            Board[GetCurrentBoardIndex()].Piece = HeldPiece;
            HeldPiece = null;
            if (!received.Payload.DidCompleteGoal.HasValue
                 && (Y < Game.BoardSize.GoalArea
                || Y >= Game.BoardSize.GoalArea + Game.BoardSize.TaskArea))
            {
                Board[GetCurrentBoardIndex()].Piece.HasInfo = true;
                Board[GetCurrentBoardIndex()].Piece.IsSham = true;
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
                Board[GetCurrentBoardIndex()].GoalStatus = GoalStatusEnum.NoGoal;
                return (true, PlaceDownPieceResult.NoScore);
            }
            else
            {
                logger.Info($"Got 1 point for placing a piece @ {X} {Y}!");
                Board[GetCurrentBoardIndex()].GoalStatus = GoalStatusEnum.CompletedGoal;
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
            var winnerTeam = (received.Payload.Team1Score > received.Payload.Team2Score) ? "Team 1" : "Team 2";
            string message = $"Cannot perform the planned action. Game has already finished.\n" +
                $"Scores:\n\tTeam 1: {received.Payload.Team1Score}\n\tTeam 2: {received.Payload.Team2Score}\n" +
                $"Congratulations {winnerTeam}! WOOP WOOP!\n";

            throw new GameAlreadyFinishedException(message);
        }

        /// <summary>
        /// Sent to another player to initiate the communication. After receiving REQUEST_SENT from GM can do sth else.
        /// </summary>
        /// <param name="recipientId"></param>
        /// <returns>True if received REQUEST_SENT message, False in case of ACTION_INVALID message</returns>
        public bool SendCommunicationRequest(string recipientId)
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationRequest,
                SenderId = Id,
                Payload = new CommunicationPayload
                {
                    TargetPlayerId = recipientId
                }
            });
            if (!GetActionStatus()) { return false; }
            _messageProvider.Receive<RequestSentPayload>();
            return true;
        }

        public bool SendCommunicationResponse(string senderId)
        {
            // here logic for the will of responding to others - that's why it is separated from the previous method for now
            var r = new Random();
            int willThePoorGuyGetDataFromMe = r.Next(0, 1);

            if (senderId == LeaderId || willThePoorGuyGetDataFromMe == 1)
            {
                logger.Info("Imma sending a response");
                return AcceptCommunication(senderId);
            }
            else
            {
                logger.Info("No cake for you");
                return RejectCommunication(senderId);
            }
        }

        /// <summary>
        /// Send the information you have about the board to the player who requested communication with you.
        /// </summary>
        /// <param name="recipientId"></param>
        /// <returns></returns>
        public bool AcceptCommunication(string recipientId)
        {
            // haven't checked how the mapping works, therefore it's written how it is now
            List<TileCommunicationDTO> boardToSend = new List<TileCommunicationDTO>();

            for (int i = 0; i < Game.BoardSize.X * (Game.BoardSize.GoalArea * 2 + Game.BoardSize.TaskArea); i++)
            {
                boardToSend.Add(AutoMapper.Mapper.Map<Tile, TileCommunicationDTO>(Board[i]));
            }

            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationResponse,
                SenderId = Id,
                Payload = new CommunicationResponsePayload
                {
                    TargetPlayerId = recipientId,
                    Accepted = true,
                    Board = boardToSend
                }
            });
            if (!GetActionStatus()) { return false; }
            _messageProvider.Receive<ResponseSentPayload>();
            return true;
        }

        /// <summary>
        /// U ain't got no time to respond to some weak players
        /// </summary>
        /// <param name="recipientId"></param>
        /// <returns></returns>
        public bool RejectCommunication(string recipientId)
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationResponse,
                SenderId = Id,
                Payload = new CommunicationResponsePayload
                {
                    TargetPlayerId = recipientId,
                    Accepted = false,
                }
            });
            if (!GetActionStatus()) { return false; }
            _messageProvider.Receive<ResponseSentPayload>();
            return true;
        }

        /// <summary>
        /// Receive the response from another player. If the answer was positive, get data from the payload
        /// </summary>
        public void UpdateBoard()
        {
            while (_messageProvider.HasPendingResponses)
            {
                var receivedBoard = _messageProvider.GetPendingResponse().Payload.Board;

                for (int i = 0; i < receivedBoard.Count; i++)
                {
                    if (!Board[i].Timestamp.HasValue || receivedBoard[i].TimeStamp > Board[i].Timestamp)
                    {
                        AutoMapper.Mapper.Map<TileCommunicationDTO, Tile>(receivedBoard[i], Board[i]);
                    }
                }
                PrintBoard();
            }
        }

        private void PrintBoard()
        {
            int i = 0;
            for (int y = 0; y < 2 * Game.BoardSize.GoalArea + Game.BoardSize.TaskArea; y++)
            {
                for (int x = 0; x < Game.BoardSize.X; x++, i++)
                {
                    var character = Board[i].HasInfo == false ? " " : "+";
                    Console.Write($"[{character}]");
                }
                Console.WriteLine();
            }
        }
    }
}
