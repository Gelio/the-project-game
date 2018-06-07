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
        private Dijkstra _dijkstra;

        public SectorStrategy(PlayerState playerState, IActionExecutor actionExecutor) : base(playerState, actionExecutor)
        {
        }

        private void InitSectorStrategy()
        {
            _sectorOwners = new List<string>(_playerState.TeamMembersIds);
            _sectorOwners.Add(_playerState.Id);
            _sectorOwners.Sort();

            _sectorId = _sectorOwners.IndexOf(_playerState.Id);
            logger.Info($"Registered to sector no. {_sectorId}");

            CreateGoalsToCheck();

            _dijkstra = new Dijkstra(_playerState);
        }

        public override void Play()
        {
            InitGoalAreaDirection();
            _actionExecutor.RefreshBoardState();
            InitSectorStrategy();
            UpdateBoard();
            while (true)
            {
                RespondOnceIfNecessary();

                if (_playerState.HeldPiece != null)
                {
                    if (!_playerState.HeldPiece.WasTested)
                    {
                        logger.Debug("Testing the piece");
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
                        if (result)
                        {
                            _goalsToCheck.Remove((_playerState.X, _playerState.Y));
                            PrintBoard();
                        }
                    }
                    else
                    {
                        var nextGoal = GetNextGoal();
                        var path = FindPathUsingAStar(nextGoal.x, nextGoal.y, ManhattanDistance);
                        if (path == null)
                            continue;
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
                    else
                    {
                        /// TODO: IF WE GET DIJKSTRA TO WORK:

                        // // go to the task area, then proceed to move to the closest piece
                        // var path = GetPathUsingDijkstra();
                        // if (path == null)
                        //     continue;

                        // //Move along calculated path until conflict
                        // foreach (var target in path)
                        //     if (!MoveOneStep(target.x, target.y))
                        //     {
                        //         // try to move one more time
                        //         Task.Delay(_random.Next(0, 2000));
                        //         if (MoveOneStep(target.x, target.y))
                        //             continue;
                        //         break;
                        //     }
                        if (!_actionExecutor.Move(PickClosestPieceDirection()))
                            _actionExecutor.Move(PickRandomMovementDirection());
                    }
                }
            }
        }

        private List<(int x, int y)> GetPathUsingDijkstra()
        {
            var obstacles = new List<int>();

            for (int i = 0; i < _playerState.Board.Count; i++)
                if (_playerState.Board[i].PlayerId != null)
                {
                    obstacles.Add(i);
                    logger.Warn(i);
                }

            _dijkstra.DijkstraAlgorithm(obstacles);
            foreach (var x in _dijkstra.Previous)
                logger.Warn(x);
            foreach (var x in _dijkstra.Distances)
                logger.Warn(x);
            int bestIndex = -1, bestDist = int.MaxValue;
            for (int i = 0; i < _playerState.Board.Count; i++)
            {
                if (_dijkstra.Previous[i] == -1)
                    continue;
                if (bestIndex == -1)
                {
                    bestIndex = i;
                    continue;
                }
                if (_playerState.Board[i].DistanceToClosestPiece != -1
                    && _playerState.Board[i].DistanceToClosestPiece < bestDist)
                {
                    bestIndex = i;
                }
            }
            logger.Warn(bestIndex);
            return _dijkstra.ShortestPath(bestIndex).Select(i => ConvertIndex(i)).ToList();
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
