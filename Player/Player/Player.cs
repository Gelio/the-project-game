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
using Player.Strategy;

namespace Player
{
    public class Player : IActionExecutor
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        // TODO: Remove ICommunicator dependency
        private ICommunicator _communicator;
        private IGameService _gameService;
        private IMessageProvider _messageProvider;
        private PlayerConfig _playerConfig;
        private PlayerState _playerState;        

        public Player(ICommunicator communicator, PlayerConfig playerConfig, IGameService gameService, IMessageProvider messageProvider, PlayerState playerState)
        {
            _communicator = communicator;
            _gameService = gameService;
            _messageProvider = messageProvider;
            _playerConfig = playerConfig;
            _playerState = playerState;
        }


        public void Start()
        {
            GetGameInfo();

            while (true)
            {
                _playerState.ResetState();

                int tries = 3;
                while (true)
                {
                    try
                    {
                        ConnectToServer();
                        break;
                    }
                    catch (PlayerRejectedException)
                    {
                        tries--;
                    }
                    if (tries == 0)
                        throw new GameAlreadyFinishedException("Game over");
                }

                WaitForGameStart();
                RefreshBoardState(); // -- gives us info about all teammates' (+ ours) initial position
                logger.Debug($"Player's init position: {_playerState.X} {_playerState.Y}");
                _playerState.GoalAreaDirection = _playerState.Y < _playerState.Game.BoardSize.GoalArea ? Consts.Up : Consts.Down;
                try
                {
                    Play();
                }
                catch (GameAlreadyFinishedException e)
                {
                    RoundFinished(e.Message);

                    logger.Info($"Waiting {_playerConfig.Timeout}s for new round...");
                    Task.Delay(_playerConfig.Timeout).Wait();
                }
            }
        }

        public void GetGameInfo()
        {
            var gamesList = _gameService.GetGamesList();
            _playerState.Game = gamesList.FirstOrDefault(x => x.Name == _playerConfig.GameName);
            if (_playerState.Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }
            _playerState.InitBoard();
        }

        public void ConnectToServer()
        {
            _messageProvider.SendMessageWithTimeout(new Message<IPayload>
            {
                Type = Consts.PlayerHelloRequest,
                SenderId = _playerState.Id,
                Payload = new PlayerHelloPayload
                {
                    Game = _playerConfig.GameName,
                    TeamId = _playerConfig.TeamNumber,
                    IsLeader = _playerConfig.IsLeader,
                }
            }, _playerConfig.Timeout);
            _messageProvider.AssertPlayerStatus(_playerConfig.Timeout);
            logger.Info($"Player ({_playerState.Id}) connected to server");
            logger.Debug($"Team no.: {_playerConfig.TeamNumber}");
            logger.Debug($"Is leader: {_playerConfig.IsLeader}");
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

            _playerState.TeamMembersIds = message.Payload.TeamInfo[_playerConfig.TeamNumber].Players;
            _playerState.TeamMembersIds.Remove(_playerState.Id);
            _playerState.TeamMembersIds.ToList().ForEach(id => _playerState.WaitingForResponse.Add(id, false));
            _playerState.LeaderId = message.Payload.TeamInfo[_playerConfig.TeamNumber].LeaderId;
            logger.Info("The game has started!");
        }

        public void Play()
        {
            var trivialStrategy = new TrivialStrategy(_playerState, this);
            trivialStrategy.Play();
        }

       
        public bool Discover()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.DiscoveryRequest,
                RecipientId = Consts.GameMasterId,
                SenderId = _playerState.Id,
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
                AutoMapper.Mapper.Map(tileDTO, _playerState.Board.At(tileDTO.X, tileDTO.Y));
                _playerState.Board.At(tileDTO.X, tileDTO.Y).Timestamp = received.Payload.Timestamp;
                if (tileDTO.Piece)
                {
                    _playerState.Board.At(tileDTO.X, tileDTO.Y).Piece = new Piece();
                }
            }
            logger.Info($"Discovered {received.Payload.Tiles.Count} tiles");
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
                SenderId = _playerState.Id,
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
                _playerState.Board.At(playerInfo.X, playerInfo.Y).PlayerId = playerInfo.PlayerId;
                _playerState.Board.At(playerInfo.X, playerInfo.Y).Timestamp = received.Payload.Timestamp;
                if (playerInfo.PlayerId == _playerState.Id)
                {
                    _playerState.X = playerInfo.X;
                    _playerState.Y = playerInfo.Y;
                    _playerState.Board.At(_playerState.X, _playerState.Y).DistanceToClosestPiece = received.Payload.CurrentPositionDistanceToClosestPiece;
                    gotOwnInfo = true;
                    if (_playerState.Board.At(_playerState.X, _playerState.Y).Piece == null && _playerState.Board.At(_playerState.X, _playerState.Y).DistanceToClosestPiece == 0)
                        _playerState.Board.At(_playerState.X, _playerState.Y).Piece = new Piece();
                }
            }

            if (!gotOwnInfo)
                throw new InvalidOperationException("No info about player");

            logger.Debug($"Player's position: ({_playerState.X}, {_playerState.Y})");
            return true;
        }

        public bool Move(string direction)
        {
            int newX = _playerState.X;
            int newY = _playerState.Y;
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
            int index = newX + _playerState.Game.BoardSize.X * newY;
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.MoveRequest,
                SenderId = _playerState.Id,
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

            _playerState.Board.At(_playerState.X, _playerState.Y).PlayerId = null;
            _playerState.Board.At(index).PlayerId = _playerState.Id;
            _playerState.Board.At(index).DistanceToClosestPiece = received.Payload.DistanceToPiece;
            _playerState.Board.At(index).Timestamp = received.Payload.TimeStamp;
            _playerState.X = newX;
            _playerState.Y = newY;
            return true;
        }

        public bool PickUpPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.PickupPieceRequest,
                SenderId = _playerState.Id,
                Payload = new PickUpPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<PickUpPieceResponsePayload>();

            _playerState.HeldPiece = _playerState.Board.At(_playerState.X, _playerState.Y).Piece;
            _playerState.Board.At(_playerState.X, _playerState.Y).Piece = null;
            _playerState.Board.At(_playerState.X, _playerState.Y).DistanceToClosestPiece = int.MaxValue;

            logger.Info("Picked up piece @ ({}, {})", _playerState.X, _playerState.Y);
            return true;
        }

        public (bool, PlaceDownPieceResult) PlaceDownPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.PlaceDownPieceRequest,
                SenderId = _playerState.Id,
                Payload = new PlaceDownPiecePayload()
            });
            if (!GetActionStatus()) { return (false, PlaceDownPieceResult.NoScore); }
            var received = _messageProvider.Receive<PlaceDownPieceResponsePayload>();

            if (received.Payload == null)
                throw new NoPayloadException();

            var piece = _playerState.HeldPiece;
            _playerState.HeldPiece = null;
            _playerState.Board.At(_playerState.X, _playerState.Y).Piece = null;

            if (!received.Payload.DidCompleteGoal.HasValue
                 && (_playerState.Y < _playerState.Game.BoardSize.GoalArea
                || _playerState.Y >= _playerState.Game.BoardSize.GoalArea + _playerState.Game.BoardSize.TaskArea))
            {
                logger.Info("The piece was a sham!");
                return (true, PlaceDownPieceResult.Sham);
            }
            else if (!received.Payload.DidCompleteGoal.HasValue)
            {
                logger.Info("Placed a piece in Task Area");
                _playerState.Board.At(_playerState.X, _playerState.Y).Piece = piece;
                return (true, PlaceDownPieceResult.TaskArea);
            }
            else if (!received.Payload.DidCompleteGoal.Value)
            {
                logger.Info("This tile is not a goal tile");
                _playerState.Board.At(_playerState.X, _playerState.Y).GoalStatus = GoalStatusEnum.NoGoal;
                return (true, PlaceDownPieceResult.NoScore);
            }
            else
            {
                logger.Info($"Got 1 point for placing a piece @ {_playerState.X} {_playerState.Y}!");
                _playerState.Board.At(_playerState.X, _playerState.Y).GoalStatus = GoalStatusEnum.CompletedGoal;
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

        public void RoundFinished(string receivedMessageSerialized)
        {
            var received = JsonConvert.DeserializeObject<Message<GameFinishedPayload>>(receivedMessageSerialized);
            var winnerTeam = (received.Payload.Team1Score > received.Payload.Team2Score) ? "Team 1" : "Team 2";
            string message = $"Scores:\n\tTeam 1: {received.Payload.Team1Score}\n\tTeam 2: {received.Payload.Team2Score}\n" +
                $"Congratulations {winnerTeam}! WOOP WOOP!\n";
            logger.Info(message);
        }


        public bool SendCommunicationRequest(string otherId)
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationRequest,
                SenderId = _playerState.Id,
                Payload = new CommunicationPayload
                {
                    TargetPlayerId = otherId
                }
            });
            if (!GetActionStatus()) { return false; }
            _playerState.WaitingForResponse[otherId] = true;
            _messageProvider.Receive<RequestSentPayload>();
            logger.Info($"Communication request sent to {otherId}");
            return true;
        }

        public bool SendCommunicationResponse(string otherId)
        {
            // here logic for the will of responding to others - that's why it is separated from the previous method for now
            var r = new Random();
            int willThePoorGuyGetDataFromMe = r.Next(0, 1);

            if (otherId == _playerState.LeaderId || willThePoorGuyGetDataFromMe == 1)
            {
                return AcceptCommunication(otherId);
            }
            else
            {
                return RejectCommunication(otherId);
            }
        }

 
        public bool AcceptCommunication(string otherId)
        {
            // haven't checked how the mapping works, therefore it's written how it is now
            List<TileCommunicationDTO> boardToSend = new List<TileCommunicationDTO>();

            for (int i = 0; i < _playerState.Game.BoardSize.X * (_playerState.Game.BoardSize.GoalArea * 2 + _playerState.Game.BoardSize.TaskArea); i++)
            {
                boardToSend.Add(AutoMapper.Mapper.Map<Tile, TileCommunicationDTO>(_playerState.Board.At(i)));
            }

            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationResponse,
                SenderId = _playerState.Id,
                Payload = new CommunicationResponsePayload
                {
                    TargetPlayerId = otherId,
                    Accepted = true,
                    Board = boardToSend
                }
            });
            if (!GetActionStatus()) { return false; }
            _messageProvider.Receive<ResponseSentPayload>();
            logger.Info($"Communication response sent to {otherId}");
            return true;
        }

        public bool RejectCommunication(string otherId)
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationResponse,
                SenderId = _playerState.Id,
                Payload = new CommunicationResponsePayload
                {
                    TargetPlayerId = otherId,
                    Accepted = false,
                }
            });
            if (!GetActionStatus()) { return false; }
            _messageProvider.Receive<ResponseSentPayload>();
            logger.Info($"Rejected communication request from {otherId}");
            return true;
        }

       

        public bool TestPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.TestPieceRequest,
                SenderId = _playerState.Id,
                Payload = new TestPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<TestPieceResponsePayload>();
            if (received.Payload == null)
                throw new NoPayloadException();

            _playerState.HeldPiece.WasTested = true;
            _playerState.HeldPiece.IsSham = received.Payload.IsSham;

            string pieceResult = received.Payload.IsSham ? "a sham" : "valid";

            logger.Info($"Held piece is {pieceResult}!");

            return true;
        }

        public bool DeletePiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.DeletePieceRequest,
                SenderId = _playerState.Id,
                Payload = new TestPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<DeletePieceResponsePayload>();

            _playerState.HeldPiece = null;
            logger.Info("Piece deleted");

            return true;
        }
    }
}
