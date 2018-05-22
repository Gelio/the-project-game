using System;
using System.Collections.Generic;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Requests;
using Player.Messages.Responses;

namespace Player
{
    public class ActionExecutor : IActionExecutor
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private IMessageProvider _messageProvider;
        private PlayerState _playerState;


        public PlayerState PlayerState => _playerState;
        public ActionExecutor(IMessageProvider messageProvider, PlayerState playerState)
        {
            _messageProvider = messageProvider;
            _playerState = playerState;
        }

        public bool AcceptCommunication(string otherId)
        {
            List<TileCommunicationDTO> boardToSend = new List<TileCommunicationDTO>();

            for (int i = 0; i < PlayerState.Game.BoardSize.X * (PlayerState.Game.BoardSize.GoalArea * 2 + PlayerState.Game.BoardSize.TaskArea); i++)
            {
                boardToSend.Add(AutoMapper.Mapper.Map<Tile, TileCommunicationDTO>(PlayerState.Board.At(i)));
            }

            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationResponse,
                SenderId = PlayerState.Id,
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

        public bool DeletePiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.DeletePieceRequest,
                SenderId = PlayerState.Id,
                Payload = new TestPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<DeletePieceResponsePayload>();

            PlayerState.HeldPiece = null;
            logger.Info("Piece deleted");

            return true;
        }

        public bool Discover()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.DiscoveryRequest,
                RecipientId = Consts.GameMasterId,
                SenderId = PlayerState.Id,
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
                AutoMapper.Mapper.Map(tileDTO, PlayerState.Board.At(tileDTO.X, tileDTO.Y));
                PlayerState.Board.At(tileDTO.X, tileDTO.Y).Timestamp = received.Payload.Timestamp;
                if (tileDTO.Piece)
                {
                    PlayerState.Board.At(tileDTO.X, tileDTO.Y).Piece = new Piece();
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

        public bool Move(string direction)
        {
            int newX = PlayerState.X;
            int newY = PlayerState.Y;
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
            int index = newX + PlayerState.Game.BoardSize.X * newY;
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.MoveRequest,
                SenderId = PlayerState.Id,
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

            PlayerState.Board.At(PlayerState.X, PlayerState.Y).PlayerId = null;
            PlayerState.Board.At(index).PlayerId = PlayerState.Id;
            PlayerState.Board.At(index).DistanceToClosestPiece = received.Payload.DistanceToPiece;
            PlayerState.Board.At(index).Timestamp = received.Payload.TimeStamp;
            PlayerState.X = newX;
            PlayerState.Y = newY;
            return true;
        }

        public bool PickUpPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.PickupPieceRequest,
                SenderId = PlayerState.Id,
                Payload = new PickUpPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<PickUpPieceResponsePayload>();

            PlayerState.HeldPiece = PlayerState.Board.At(PlayerState.X, PlayerState.Y).Piece;
            PlayerState.Board.At(PlayerState.X, PlayerState.Y).Piece = null;
            PlayerState.Board.At(PlayerState.X, PlayerState.Y).DistanceToClosestPiece = int.MaxValue;

            logger.Info("Picked up piece @ ({}, {})", PlayerState.X, PlayerState.Y);
            return true;
        }

        public (bool, PlaceDownPieceResult) PlaceDownPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.PlaceDownPieceRequest,
                SenderId = PlayerState.Id,
                Payload = new PlaceDownPiecePayload()
            });
            if (!GetActionStatus()) { return (false, PlaceDownPieceResult.NoScore); }
            var received = _messageProvider.Receive<PlaceDownPieceResponsePayload>();

            if (received.Payload == null)
                throw new NoPayloadException();

            var piece = PlayerState.HeldPiece;
            PlayerState.HeldPiece = null;
            PlayerState.Board.At(PlayerState.X, PlayerState.Y).Piece = null;

            if (!received.Payload.DidCompleteGoal.HasValue
                 && (PlayerState.Y < PlayerState.Game.BoardSize.GoalArea
                || PlayerState.Y >= PlayerState.Game.BoardSize.GoalArea + PlayerState.Game.BoardSize.TaskArea))
            {
                logger.Info("The piece was a sham!");
                return (true, PlaceDownPieceResult.Sham);
            }
            else if (!received.Payload.DidCompleteGoal.HasValue)
            {
                logger.Info("Placed a piece in Task Area");
                PlayerState.Board.At(PlayerState.X, PlayerState.Y).Piece = piece;
                return (true, PlaceDownPieceResult.TaskArea);
            }
            else if (!received.Payload.DidCompleteGoal.Value)
            {
                logger.Info("This tile is not a goal tile");
                PlayerState.Board.At(PlayerState.X, PlayerState.Y).GoalStatus = GoalStatusEnum.NoGoal;
                return (true, PlaceDownPieceResult.NoScore);
            }
            else
            {
                logger.Info($"Got 1 point for placing a piece @ {PlayerState.X} {PlayerState.Y}!");
                PlayerState.Board.At(PlayerState.X, PlayerState.Y).GoalStatus = GoalStatusEnum.CompletedGoal;
                return (true, PlaceDownPieceResult.Score);
            }
        }

        public bool RefreshBoardState()
        {

            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.RefreshStateRequest,
                SenderId = PlayerState.Id,
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
                PlayerState.Board.At(playerInfo.X, playerInfo.Y).PlayerId = playerInfo.PlayerId;
                PlayerState.Board.At(playerInfo.X, playerInfo.Y).Timestamp = received.Payload.Timestamp;
                if (playerInfo.PlayerId == PlayerState.Id)
                {
                    PlayerState.X = playerInfo.X;
                    PlayerState.Y = playerInfo.Y;
                    PlayerState.Board.At(PlayerState.X, PlayerState.Y).DistanceToClosestPiece = received.Payload.CurrentPositionDistanceToClosestPiece;
                    gotOwnInfo = true;
                    if (PlayerState.Board.At(PlayerState.X, PlayerState.Y).Piece == null && PlayerState.Board.At(PlayerState.X, PlayerState.Y).DistanceToClosestPiece == 0)
                        PlayerState.Board.At(PlayerState.X, PlayerState.Y).Piece = new Piece();
                }
            }

            if (!gotOwnInfo)
                throw new InvalidOperationException("No info about player");

            logger.Debug($"Player's position: ({PlayerState.X}, {PlayerState.Y})");
            return true;
        }

        public bool RejectCommunication(string otherId)
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationResponse,
                SenderId = PlayerState.Id,
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

        public bool SendCommunicationRequest(string otherId)
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.CommunicationRequest,
                SenderId = PlayerState.Id,
                Payload = new CommunicationPayload
                {
                    TargetPlayerId = otherId
                }
            });
            if (!GetActionStatus()) { return false; }
            PlayerState.WaitingForResponse[otherId] = true;
            _messageProvider.Receive<RequestSentPayload>();
            logger.Info($"Communication request sent to {otherId}");
            return true;
        }

        public bool SendCommunicationResponse(string otherId)
        {
            var r = new Random();
            int willThePoorGuyGetDataFromMe = r.Next(0, 1);

            if (otherId == PlayerState.LeaderId || willThePoorGuyGetDataFromMe == 1)
            {
                return AcceptCommunication(otherId);
            }
            else
            {
                return RejectCommunication(otherId);
            }
        }

        public bool TestPiece()
        {
            _messageProvider.SendMessage(new Message<IPayload>()
            {
                Type = Consts.TestPieceRequest,
                SenderId = PlayerState.Id,
                Payload = new TestPiecePayload()
            });
            if (!GetActionStatus()) { return false; }
            var received = _messageProvider.Receive<TestPieceResponsePayload>();
            if (received.Payload == null)
                throw new NoPayloadException();

            PlayerState.HeldPiece.WasTested = true;
            PlayerState.HeldPiece.IsSham = received.Payload.IsSham;

            string pieceResult = received.Payload.IsSham ? "a sham" : "valid";

            logger.Info($"Held piece is {pieceResult}!");

            return true;
        }
    }
}
