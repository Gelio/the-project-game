using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using System;

namespace Player.Strategy
{
    public class TrivialStrategy : AbstractStrategy
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public TrivialStrategy(PlayerState playerState, IActionExecutor actionExecuter) : base(playerState, actionExecuter) { }

        public override void Play()
        {
            InitGoalAreaDirection();
            while (true)
            {
                _actionExecuter.RefreshBoardState();
                UpdateBoard();

                if (_playerState.HasPendingRequests)
                {
                    // Discover();
                    var senderId = _playerState.GetPendingRequest().Payload.SenderPlayerId;

                    _actionExecuter.SendCommunicationResponse(senderId);
                    if (_playerState.PlayerConfig.IsLeader)
                        _actionExecuter.SendCommunicationRequest(senderId);
                }
                if (_playerState.PlayerConfig.IsLeader && _playerState.TeamMembersIds.Count > 0)
                {
                    var index = new Random().Next(0, _playerState.TeamMembersIds.Count - 1);
                    var targetId = _playerState.TeamMembersIds[index];
                    if (targetId != null && !_playerState.WaitingForResponse[targetId])
                        _actionExecuter.SendCommunicationRequest(targetId);
                }

                if (_playerState.HeldPiece != null)
                {
                    if (!_playerState.HeldPiece.WasTested)
                    {
                        logger.Info("Testing the piece");
                        _actionExecuter.TestPiece();
                        if (_playerState.HeldPiece.IsSham)
                        {
                            logger.Info("The piece was a sham -- deleting the piece");
                            _actionExecuter.DeletePiece();
                        }
                    }

                    if (_playerState.Board.IsGoalArea(_playerState.X, _playerState.Y) && _playerState.Board.At(_playerState.X, _playerState.Y).GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        logger.Info("Trying to place down piece");
                        (var result, var resultEnum) = _actionExecuter.PlaceDownPiece();
                        _actionExecuter.SendCommunicationRequest(_playerState.LeaderId);
                    }
                    else
                    {
                        if (!_actionExecuter.Move(PickSweepingGoalAreaDirection()))
                            _actionExecuter.Move(PickRandomMovementDirection());
                    }

                }
                else if (_playerState.Board.At(_playerState.X, _playerState.Y).DistanceToClosestPiece == 0) // We stand on a piece
                {
                    logger.Info("Trying to pick up piece...");
                    _actionExecuter.PickUpPiece();
                    continue;
                }
                else // Find a piece
                {
                    _actionExecuter.Discover();
                    if (_playerState.Board.IsGoalArea(_playerState.X, _playerState.Y))
                    {
                        string dir = _playerState.GoalAreaDirection == "up" ? "down" : "up";

                        if (!_actionExecuter.Move(dir))
                        {
                            _actionExecuter.Move(PickRandomMovementHorizontalDirection());
                        }
                    }
                    // go to the task area, then proceed to move to the closest piece
                    else if (!_actionExecuter.Move(PickClosestPieceDirection()))
                        _actionExecuter.Move(PickRandomMovementDirection());
                }
            }
        }
    }
}
