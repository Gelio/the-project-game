using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Player.Strategy
{
    public class SectorStrategy : AbstractStrategy
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private int _sectorId;
        private List<string> _sectorOwners;
        private HashSet<(int x, int y)> _goalsToCheck;

        public SectorStrategy(PlayerState playerState, IActionExecutor actionExecutor) : base(playerState, actionExecutor)
        {
            _sectorOwners = new List<string>(_playerState.TeamMembersIds);
            _sectorOwners.Add(_playerState.Id);
            _sectorOwners.Sort();

            _sectorId = _sectorOwners.IndexOf(_playerState.Id);
            logger.Info($"Registered to sector no. {_sectorId}");

            CreateGoalsToCheck();
        }

        public override void Play()
        {
            InitGoalAreaDirection();
            _actionExecutor.RefreshBoardState();
            UpdateBoard();
            while (true)
            {
                RespondOnceIfNecessary();

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
                    // We have a valid piece

                    if (_playerState.Board.IsGoalArea(_playerState.X, _playerState.Y) && _playerState.Board.At(_playerState.X, _playerState.Y).GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        logger.Info("Trying to place down piece");
                        (var result, var resultEnum) = _actionExecutor.PlaceDownPiece();
                        if (result) _goalsToCheck.Remove((_playerState.X, _playerState.Y));
                    }
                    else
                    {
                        var nextGoal = GetNextGoal();
                        var path = FindPathUsingAStar(nextGoal.x, nextGoal.y, ManhattanDistance);

                        // Move along calculated path until conflict
                        foreach (var target in path)
                            if (!MoveOneStep(target.x, target.y))
                            {
                                // try to move one more time
                                Task.Delay(_random.Next(0, 2000));
                                if (MoveOneStep(target.x, target.y))
                                    continue;
                                break;
                            }
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
                    var bestTile = GetBestTile();
                    var path = FindPathUsingAStar(bestTile.x, bestTile.y, ManhattanDistance, 2);

                    // Move along calculated path until conflict
                    foreach (var target in path)
                        if (!MoveOneStep(target.x, target.y))
                        {
                            // try to move one more time
                            Task.Delay(_random.Next(0, 2000));
                            if (MoveOneStep(target.x, target.y))
                                continue;
                            break;
                        }
                }
            }
        }

        private (int x, int y) GetBestTile()
        {
            int bestIndex = 0, bestDist = int.MaxValue;
            for (int i = 0; i < _playerState.Board.SizeX * _playerState.Board.SizeY; i++)
            {
                if (_playerState.Board[i].DistanceToClosestPiece != -1
                    && _playerState.Board[i].DistanceToClosestPiece < bestDist)
                {
                    bestIndex = i;
                }
            }
            return ConvertIndex(bestIndex);
        }


        private void ChangeSector()
        {
            _sectorId = (_sectorId + 1) % _sectorOwners.Count;
            logger.Info($"Sector changed to {_sectorId}");

            _actionExecutor.SendCommunicationRequest(_sectorOwners[_sectorId]);
            _actionExecutor.WaitForAnyResponse();
            UpdateBoard();
            CreateGoalsToCheck();
        }

        private void CreateGoalsToCheck()
        {
            int y = (_playerState.GoalAreaDirection == "up") ? 0 : _playerState.Board.SecondGoalAreaTopY;
            int yMax = (_playerState.GoalAreaDirection == "up") ? _playerState.Board.GoalAreaSize : _playerState.Board.SizeY;
            int x = _sectorId * (_playerState.Board.SizeX / (_sectorOwners.Count));
            int xMax = _sectorId == _sectorOwners.Count ? _playerState.Board.SizeX : (_sectorId + 1) * (_playerState.Board.SizeX / (_sectorOwners.Count));

            _goalsToCheck = new HashSet<(int x, int y)>();
            for (; x < xMax; x++)
                for (; y < yMax; y++)
                    if (_playerState.Board.At(x, y).GoalStatus == GoalStatusEnum.NoInfo)
                        _goalsToCheck.Add((x, y));
        }

        private (int x, int y) GetNextGoal()
        {
            while (_goalsToCheck.Count == 0)
                ChangeSector();

            var target = _goalsToCheck.First();
            _goalsToCheck.Remove(target);
            return target;
        }

    }
}
