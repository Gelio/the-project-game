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
            }
        }

        private void GoToEnemyArea()
        {
            int targetX = _playerState.Game.BoardSize.X / 2;
            int targetY = _playerState.GoalAreaDirection == "up" ? _playerState.Game.BoardSize.TaskArea + _playerState.Game.BoardSize.GoalArea - 1 : _playerState.Game.BoardSize.GoalArea;
            logger.Info($"Going to enemy area, to ({targetX}, {targetY})!");

            while (_playerState.X != targetX || _playerState.Y != targetY)
            {
                List<(int x, int y)> path = FindPathUsingAStar(targetX, targetY);
                if (path == null)
                {
                    RemoveCachedInfo();
                    path = FindPathUsingAStar(targetX, targetY);
                }
                if (path == null)
                    return;

                string stringPath = $"Path: ({_playerState.X}, {_playerState.Y}) ";
                path.ForEach(tup => stringPath += $"-> ({tup.x}, {tup.y}) ");
                logger.Trace(stringPath);

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
            logger.Info("I'm in enemy area!");
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


        private bool MoveToTileWithoutDiscovery(int targetX, int targetY)
        {
            while (_playerState.X != targetX || _playerState.Y != targetY)
            {
                bool moved = false;
                var directions = PickNaturalDirections(targetX, targetY);
                foreach (var direction in directions)
                    if (_actionExecutor.Move(direction))
                    {
                        moved = true;
                        break;
                    }
                if (moved)
                    continue;
            }
            return true;
        }

        private List<string> PickNaturalDirections(int targetX, int targetY)
        {
            int dxSign = targetX - _playerState.X > 0 ? 1 : targetX - _playerState.X < 0 ? -1 : 0;
            int dySign = targetY - _playerState.Y > 0 ? 1 : targetY - _playerState.Y < 0 ? -1 : 0;

            return _naturalDirections[(dxSign, dySign)];
        }
        private static Dictionary<(int, int), List<string>> _naturalDirections = new Dictionary<(int, int), List<string>>()
            {
                {(1, 0), new List<string>{"right"}},
                {(-1, 0), new List<string>{"left"}},
                {(0, 1), new List<string>{"down"}},
                {(0, -1), new List<string>{"up"}},
                {(1, 1),  new List<string>{"right", "down"}},
                {(1, -1), new List<string>{"right", "up"}},
                {(-1, -1),new List<string>{"left" ,"up"}},
                {(-1, 1), new List<string>{"left" ,"down"}}
            };

        private List<(int x, int y)> FindPathUsingAStar(int targetX, int targetY)
        {
            logger.Debug("Running A* computation");
            (int x, int y) start = (_playerState.X, _playerState.Y);
            (int x, int y) target = (targetX, targetY);

            var g = new Dictionary<(int, int), int>();
            var f = new Dictionary<(int, int), int>();
            var cameFrom = new Dictionary<(int, int), (int, int)>();
            var closedSet = new HashSet<(int, int)>();
            var openSet = new HashSet<(int, int)>();
            const int weight = 1;

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
                    var hScore = weight * ManhattanDistance(neighbour, target);
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
                return path.Skip(1).ToList();
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
