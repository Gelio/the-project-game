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

        public BlockerStrategy(PlayerState playerState, IActionExecutor actionExecuter) : base(playerState, actionExecuter) { }

        public override void Play()
        {
            InitGoalAreaDirection();
            while (true)
            {
                _actionExecutor.RefreshBoardState();
                UpdateBoard();
                GoToEnemyArea();
                GuardEdge();
            }
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

            int targetX = 0;
            while (true)
            {
                path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                if (path == null)
                {
                    RemoveCachedInfo();
                    path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                }
                while (path == null)
                {
                    Task.Delay(_random.Next(0, 2000));
                    path = FindPathUsingAStar(targetX, targetY, ManhattanDistance, 2);
                }

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
                if (_playerState.X == targetX)
                    targetX = targetX == 0 ? _playerState.Board.SizeX - 1 : 0;
            }
        }

        private bool MoveOneStep(int targetX, int targetY)
        {
            int dx = targetX - _playerState.X;
            int dy = targetY - _playerState.Y;

            // sanity check
            if (Math.Abs(dx) > 1 || Math.Abs(dy) > 1 || dx * dy != 0)
            {
                logger.Warn($"`MoveOneStep` method cannot be used to move from ({_playerState.X}, {_playerState.Y}) to ({targetX}, {targetY})!");
                return false;
            }

            var direction = _naturalDirections[(dx, dy)][0];
            return _actionExecutor.Move(direction);
        }

        private void RemoveCachedInfo()
        {
            _playerState.Board.Reset();
        }

        private List<(int x, int y)> FindPathUsingAStar(int targetX, int targetY, Func<(int x, int y), (int x, int y), int> heuristicFunc, int weight)
        {
            logger.Debug("Running A* computation");
            (int x, int y) start = (_playerState.X, _playerState.Y);
            (int x, int y) target = (targetX, targetY);

            var g = new Dictionary<(int, int), int>();
            var f = new Dictionary<(int, int), int>();
            var cameFrom = new Dictionary<(int, int), (int, int)>();
            var closedSet = new HashSet<(int, int)>();
            var openSet = new HashSet<(int, int)>();

            openSet.Add(start);
            f.Add(start, 0);
            g.Add(start, 0);

            while (openSet.Count > 0)
            {
                (int x, int y) current = openSet.OrderBy(coord => f[coord]).First();
                logger.Trace($"current = {current}");
                if (current.x == target.x && current.y == target.y)
                    return ReconstructPath(current);

                openSet.Remove(current);
                closedSet.Add(current);

                foreach (var neighbour in Neighbours(current))
                {
                    logger.Trace($"\tneighbour = {neighbour}");
                    if (closedSet.Contains(neighbour))
                        continue;
                    if (!openSet.Contains(neighbour))
                        openSet.Add(neighbour);

                    var gScore = g[current] + 1;
                    var hScore = weight * heuristicFunc(neighbour, target);
                    var fScore = gScore + hScore;

                    if (g.ContainsKey(neighbour) && gScore >= g[neighbour])
                        continue;

                    cameFrom[neighbour] = current;
                    g[neighbour] = gScore;
                    f[neighbour] = fScore;
                }
            }

            logger.Warn($"Can't find a path to ({targetX}, {targetY})!");
            return null;

            List<(int x, int y)> ReconstructPath((int x, int y) current)
            {
                logger.Trace($"Reconstructing path");
                var path = new List<(int x, int y)>();
                path.Add(current);
                while (cameFrom.ContainsKey(current))
                {
                    current = cameFrom[current];
                    path.Add(current); // adds to end
                }
                path.Reverse();
                var result = path.Skip(1).ToList();

                string stringPath = $"Path: ({_playerState.X}, {_playerState.Y}) ";
                result.ForEach(tup => stringPath += $"-> ({tup.x}, {tup.y}) ");
                logger.Trace(stringPath);

                return result;
            }

            IEnumerable<(int x, int y)> Neighbours((int x, int y) current)
            {
                var possibleMoves = new List<(int x, int y)> {
                    (current.x - 1, current.y),
                    (current.x + 1, current.y),
                    (current.x, current.y - 1),
                    (current.x, current.y + 1)
                    };

                return possibleMoves.Where(tup =>
                    {
                        int x = tup.Item1;
                        int y = tup.Item2;
                        bool inBounds = false;
                        if (_playerState.GoalAreaDirection == "up")
                            inBounds = x >= 0 && x < _playerState.Board.SizeX && y >= 0 && y < _playerState.Game.BoardSize.GoalArea + _playerState.Game.BoardSize.TaskArea;
                        else
                            inBounds = x >= 0 && x < _playerState.Board.SizeX && y >= _playerState.Game.BoardSize.GoalArea && y < _playerState.Board.SizeY;
                        if (!inBounds)
                            return false;
                        return _playerState.Board.At(x, y).PlayerId == null;
                    });
            }
        }
        private int ManhattanDistance((int x, int y) start, (int x, int y) end)
        {
            return Math.Abs(start.x - end.x) + Math.Abs(start.y - end.y);
        }


    }
}
