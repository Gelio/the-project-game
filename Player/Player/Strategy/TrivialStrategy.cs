using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using System;

namespace Player.Strategy
{
    public class TrivialStrategy : AbstractStrategy
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public TrivialStrategy(PlayerState playerState, IActionExecutor actionExecutor) : base(playerState, actionExecutor) { }

        public override void Play()
        {
            InitGoalAreaDirection();
            while (true)
            {
                _actionExecutor.RefreshBoardState();
                UpdateBoard();

                if (_playerState.HasPendingRequests)
                {
                    // Discover();
                    var senderId = _playerState.GetPendingRequest().Payload.SenderPlayerId;

                    _actionExecutor.SendCommunicationResponse(senderId);
                    if (_playerState.PlayerConfig.IsLeader)
                        _actionExecutor.SendCommunicationRequest(senderId);
                }
                // if (_playerState.PlayerConfig.IsLeader && _playerState.TeamMembersIds.Count > 0)
                // {
                //     var index = new Random().Next(0, _playerState.TeamMembersIds.Count - 1);
                //     var targetId = _playerState.TeamMembersIds[index];
                //     if (targetId != null && !_playerState.WaitingForResponse[targetId])
                //         _actionExecutor.SendCommunicationRequest(targetId);
                // }

                if (_playerState.HeldPiece != null)
                {
                    if (!_playerState.HeldPiece.WasTested)
                    {
                        logger.Info("Testing the piece");
                        _actionExecutor.TestPiece();
                        if (_playerState.HeldPiece.IsSham)
                        {
                            logger.Info("The piece was a sham -- deleting the piece");
                            _actionExecutor.DeletePiece();
                        }
                    }

                    if (_playerState.Board.IsGoalArea(_playerState.X, _playerState.Y) && _playerState.Board.At(_playerState.X, _playerState.Y).GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        logger.Info("Trying to place down piece");
                        (var result, var resultEnum) = _actionExecutor.PlaceDownPiece();
                        if (_playerState.Id != _playerState.LeaderId)
                            _actionExecutor.SendCommunicationRequest(_playerState.LeaderId);
                    }
                    else
                    {
                        if (!_actionExecutor.Move(PickSweepingGoalAreaDirection()))
                            _actionExecutor.Move(PickRandomMovementDirection());
                    }

                }
                else if (_playerState.Board.At(_playerState.X, _playerState.Y).DistanceToClosestPiece == 0) // We stand on a piece
                {
                    logger.Info("Trying to pick up piece...");
                    _actionExecutor.PickUpPiece();
                    continue;
                }
                else // Find a piece
                {
                    _actionExecutor.Discover();
                    if (_playerState.Board.IsGoalArea(_playerState.X, _playerState.Y))
                    {
                        string dir = _playerState.GoalAreaDirection == "up" ? "down" : "up";

                        if (!_actionExecutor.Move(dir))
                        {
                            _actionExecutor.Move(PickRandomMovementHorizontalDirection());
                        }
                    }
                    // go to the task area, then proceed to move to the closest piece
                    else if (!_actionExecutor.Move(PickClosestPieceDirection()))
                        _actionExecutor.Move(PickRandomMovementDirection());
                }
            }
        }
    }
}
