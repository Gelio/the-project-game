using System;
using System.Collections.Generic;
using System.Linq;
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

        public ActionExecutor(IMessageProvider messageProvider, PlayerState playerState)
        {
            _messageProvider = messageProvider;
            _playerState = playerState;
        }

        public bool AcceptCommunication(string otherId)
        {
            List<TileCommunicationDTO> boardToSend = new List<TileCommunicationDTO>();

            for (int i = 0; i < _playerState.Game.BoardSize.Area; i++)
            {
                var tile = _playerState.Board[i];
                var tileDTO = AutoMapper.Mapper.Map<Tile, TileCommunicationDTO>(tile);
                if (IsInGoalArea(i) && tile.GoalStatus == GoalStatusEnum.NoInfo)
                    tileDTO.TimeStamp = 0; // Critical for SectorStrategy to let the receiver know this tile was not checked!
                boardToSend.Add(tileDTO);
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
            logger.Debug($"Discovered {received.Payload.Tiles.Count} tiles");
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

        public bool IsInGoalArea(int index)
        {
            return (_playerState.GoalAreaDirection == "up")
                        ? index < _playerState.Board.SizeX * _playerState.Board.GoalAreaSize
                        : index >= _playerState.Board.SizeX * _playerState.Board.SecondGoalAreaTopY;
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

            var playerIds = received.Payload.PlayerPositions.Select(dto => dto.PlayerId).ToList();
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
            _playerState.Board.RemoveCachedPlayerIds(playerIds, received.Payload.Timestamp);

            if (!gotOwnInfo)
                throw new InvalidOperationException("No info about player");

            logger.Debug($"Player's position: ({_playerState.X}, {_playerState.Y})");
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

        ///<summary>This method will block forever if no communication response is received!</summary>
        public void WaitForAnyResponse()
        {
            _messageProvider.Receive<CommunicationResponsePayload>();
        }
    }
}
