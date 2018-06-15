using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Player.Strategy
{
    public class BlockerStrategy : AbstractStrategy
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public BlockerStrategy(PlayerState playerState, IActionExecutor actionExecutor) : base(playerState, actionExecutor) { }

        public override void Play()
        {
            InitGoalAreaDirection();
            _actionExecutor.RefreshBoardState();
            UpdateBoard();
            BlockCorner();
            while (true)
            {
                _actionExecutor.RefreshBoardState();
                if (_playerState.CurrentTile.Piece != null)
                {
                    InteractWithPiece();
                }
                if (_playerState.HasPendingResponses)
                {
                    UpdateBoard();
                    DoTheRightThing();
                    BlockCorner();
                }
                // if (_playerState.HasPendingRequests)
                // {
                //     _actionExecutor.Discover();
                //     _actionExecutor.AcceptCommunication(_playerState.GetPendingRequest().Payload.SenderPlayerId);
                // }
            }
        }
        private void BlockCorner()
        {
            int targetX = _random.Next() % 2 == 0 ? 0 : _playerState.Board.SizeX - 1;
            int targetY = _playerState.GoalAreaDirection == "up" ? _playerState.Game.BoardSize.TaskArea + _playerState.Game.BoardSize.GoalArea - 1 : _playerState.Game.BoardSize.GoalArea;
            logger.Info($"Going to corner near the enemy area ({targetX}, {targetY})!");

            while (_playerState.X != targetX || _playerState.Y != targetY)
            {
                List<(int x, int y)> path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                if (path == null)
                {
                    RemoveCachedInfo();
                    path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                }
                if (path == null)
                {
                    targetX = targetX == 0 ? _playerState.Board.SizeX - 1 : 0;
                    continue;
                }

                // Move along calculated path until conflict
                foreach (var target in path)
                    if (!MoveOneStep(target.x, target.y))
                    {
                        // try to move one more time
                        Task.Delay(_random.Next(0, 2000));
                        if (MoveOneStep(target.x, target.y))
                            continue;
                        // if it fails 2nd time, change corner, update board and calculate new path
                        targetX = targetX == 0 ? _playerState.Board.SizeX - 1 : 0;
                        _actionExecutor.Discover();
                        break;
                    }
            }
            logger.Info("I'm right next to enemy area!");
        }

        private void InteractWithPiece()
        {
            logger.Info("Interacting with piece");
            _actionExecutor.PickUpPiece();
            _actionExecutor.TestPiece();
            if (_playerState.HeldPiece.IsSham)
                _actionExecutor.DeletePiece();
            else // carry it home
            {
                _actionExecutor.SendCommunicationRequest(_playerState.LeaderId);
            }
        }

        private void DoTheRightThing()
        {
            logger.Info("Doing the right thing!");

            (int targetX, int targetY) = FindClosestUncoveredGoalArea();

            while (_playerState.X != targetX || _playerState.Y != targetY)
            {
                List<(int x, int y)> path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                if (path == null)
                {
                    RemoveCachedInfo();
                    path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                }
                if (path == null)
                {
                    logger.Warn("I don't care.");
                    _actionExecutor.DeletePiece();
                    return;
                }

                // Move along calculated path until conflict
                foreach (var target in path)
                    if (!MoveOneStep(target.x, target.y))
                    {
                        // try to move one more time
                        Task.Delay(_random.Next(0, 2000));
                        if (MoveOneStep(target.x, target.y))
                            continue;
                        // if it fails 2nd time, update board and calculate new path
                        _actionExecutor.Discover();
                        break;
                    }
            }

            _actionExecutor.PlaceDownPiece();
        }

        private (int x, int y) FindClosestUncoveredGoalArea()
        {
            var board = _playerState.Board;
            var curPos = (_playerState.X, _playerState.Y);

            int bestDist = int.MaxValue;
            (int x, int y) bestResult = (-1, -1);

            int y = (_playerState.GoalAreaDirection == "up") ? 0 : board.SecondGoalAreaTopY;
            int yMax = (_playerState.GoalAreaDirection == "up") ? board.GoalAreaSize : board.SizeY;
            for (; y < yMax; ++y)
                for (int x = 0; x < board.SizeX; ++x)
                    if (board.At(x, y).GoalStatus == GoalStatusEnum.NoInfo && ManhattanDistance(curPos, (x, y)) < bestDist)
                    {
                        bestDist = ManhattanDistance(curPos, (x, y));
                        bestResult = (x, y);
                    }

            return bestResult;
        }
        private void GoToEnemyArea()
        {
            int targetX = _playerState.Game.BoardSize.X / 2;
            int targetY = _playerState.GoalAreaDirection == "up" ? _playerState.Game.BoardSize.TaskArea + _playerState.Game.BoardSize.GoalArea - 1 : _playerState.Game.BoardSize.GoalArea;
            logger.Info($"Going to edge near the enemy area, to ({targetX}, {targetY})!");

            while (_playerState.X != targetX || _playerState.Y != targetY)
            {
                List<(int x, int y)> path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                if (path == null)
                {
                    RemoveCachedInfo();
                    path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                }
                if (path == null)
                    return;

                // Move along calculated path until conflict
                foreach (var target in path)
                    if (!MoveOneStep(target.x, target.y))
                    {
                        // try to move one more time
                        Task.Delay(_random.Next(0, 2000));
                        if (MoveOneStep(target.x, target.y))
                            continue;
                        // if it fails 2nd time, update board and calculate new path
                        _actionExecutor.Discover();
                        break;
                    }
            }
            logger.Info("I'm right next to enemy area!");
        }
        private void GuardEdge()
        {
            logger.Debug("Time to guard the enemy edge!");
            List<(int x, int y)> path;
            int targetY = _playerState.Y;

            int targetX = _random.Next() % 2 == 0 ? 0 : _playerState.Board.SizeX - 1;
            while (true)
            {
                _actionExecutor.RefreshBoardState();
                path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                if (path == null)
                {
                    RemoveCachedInfo();
                    path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                }
                if (path == null)
                {
                    targetX = targetX == 0 ? _playerState.Board.SizeX - 1 : 0;
                    continue;
                }

                foreach (var target in path)
                {
                    var hasMoved = MoveOneStep(target.x, target.y);
                    if (!hasMoved)
                    {
                        // try to move one more time
                        Task.Delay(_random.Next(0, 2000));
                        if (MoveOneStep(target.x, target.y))
                            continue;
                        // if it fails 2nd time, update board and calculate new path
                        _actionExecutor.Discover();
                        break;
                    }
                }
                if (_playerState.X == targetX)
                    targetX = targetX == 0 ? _playerState.Board.SizeX - 1 : 0;
            }
        }

        private void RemoveCachedInfo()
        {
            _playerState.Board.Reset();
        }
    }
}
