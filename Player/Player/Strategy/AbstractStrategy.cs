using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Responses;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Player.Strategy
{
    public abstract class AbstractStrategy
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        protected static Dictionary<(int, int), List<string>> _naturalDirections = new Dictionary<(int, int), List<string>>()
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
        protected PlayerState _playerState;
        protected IActionExecutor _actionExecutor;
        protected Random _random = new Random(System.DateTime.Now.Millisecond);

        public AbstractStrategy() { }

        public AbstractStrategy(PlayerState playerState, IActionExecutor actionExecutor)
        {
            _playerState = playerState;
            _actionExecutor = actionExecutor;
        }

        public abstract void Play();

        protected void InitGoalAreaDirection()
        {
            _actionExecutor.RefreshBoardState();
            _playerState.GoalAreaDirection = _playerState.Y < _playerState.Game.BoardSize.GoalArea ? Consts.Up : Consts.Down;
            logger.Debug($"Player's goal area direction: {_playerState.GoalAreaDirection}");
            logger.Debug($"Player's init position: {_playerState.X} {_playerState.Y}");
        }

        protected void UpdateBoard()
        {
            while (_playerState.HasPendingResponses)
            {
                var receivedMessage = _playerState.GetPendingResponse();
                var receivedBoard = receivedMessage.Payload.Board;
                var otherId = receivedMessage.Payload.SenderPlayerId;

                _playerState.WaitingForResponse[otherId] = false;
                logger.Debug($"Updating board using info from {otherId}");

                for (int i = 0; i < receivedBoard.Count; i++)
                {
                    if (receivedBoard[i].TimeStamp > _playerState.Board.At(i).Timestamp)
                    {
                        _playerState.Board[i] = AutoMapper.Mapper.Map<Tile>(receivedBoard[i]);
                        if (_actionExecutor.IsInGoalArea(i) && receivedBoard[i].TimeStamp != 0)
                            _playerState.Board[i].GoalStatus = GoalStatusEnum.NoGoal;
                    }
                }
                // PrintBoard();
            }
        }

        protected void PrintBoard()
        {
            int i = 0;
            logger.Debug("---- Goal Status (x = checked) ----");
            for (int y = 0; y < _playerState.Game.BoardSize.Y; y++)
            {
                string line = "";
                for (int x = 0; x < _playerState.Game.BoardSize.X; x++, i++)
                {
                    var character = _playerState.Board.At(i).GoalStatus == GoalStatusEnum.NoInfo ? " " : "+";
                    line += $"[{character}]";
                }
                logger.Debug(line);
            }
        }

        protected string PickRandomMovementDirection()
        {
            string[] directions = { Consts.Up, Consts.Down, Consts.Left, Consts.Right };
            return directions[new Random().Next(0, 4)];
        }

        protected string PickRandomMovementHorizontalDirection()
        {
            string[] directions = { Consts.Left, Consts.Right };
            return directions[new Random().Next(0, 2)];
        }

        protected string PickSweepingGoalAreaDirection()
        {
            int startX, startY, endX, endY, dy;
            startX = 0;
            endX = _playerState.Game.BoardSize.X - 1;
            if (_playerState.GoalAreaDirection == Consts.Up)
            {
                startY = _playerState.Game.BoardSize.GoalArea - 1;
                endY = -1;
                dy = -1;
            }
            else
            {
                startY = _playerState.Game.BoardSize.GoalArea + _playerState.Game.BoardSize.TaskArea;
                endY = _playerState.Game.BoardSize.Y;
                dy = 1;
            }

            // Find first tile with no info, first searching on horizontal axis *closest* to task area.
            // Then change axis moving outward (towards horizontal edge of the board) each outer loop iteration
            for (int y = startY; y != endY; y += dy)
                for (int x = startX; x <= endX; x++)
                    if (_playerState.Board.At(x, y).GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        if (_playerState.X - x > 0)
                            return Consts.Left;
                        if (_playerState.X - x < 0)
                            return Consts.Right;
                        if (_playerState.Y - y > 0)
                            return Consts.Up;
                        else
                            return Consts.Down;
                    }
            throw new InvalidOperationException("There seems to be no goal tiles left");
        }

        protected string PickClosestPieceDirection()
        {
            int bestDistance = int.MaxValue;
            int bestDx = 0, bestDy = 0;
            int x = _playerState.X;
            int y = _playerState.Y;
            for (int dy = -1; dy <= 1; dy++)
                for (int dx = -1; dx <= 1; dx++)
                {
                    if (x + dx < 0 || x + dx >= _playerState.Game.BoardSize.X || y + dy < 0 || y + dy >= _playerState.Game.BoardSize.Y)
                        continue;
                    int index = x + dx + _playerState.Game.BoardSize.X * (y + dy);
                    if (_playerState.Board.At(index).DistanceToClosestPiece != -1 && _playerState.Board.At(index).DistanceToClosestPiece < bestDistance)
                    {
                        bestDistance = _playerState.Board.At(index).DistanceToClosestPiece;
                        bestDx = dx;
                        bestDy = dy;
                    }
                }
            if (bestDy == -1)
                return Consts.Up;
            if (bestDy == 1)
                return Consts.Down;
            if (bestDx == -1)
                return Consts.Left;
            if (bestDx == 1)
                return Consts.Right;
            return Consts.Up;
        }

        protected void RespondOnceIfNecessary()
        {
            if (_playerState.HasPendingRequests)
            {
                var senderId = _playerState.GetPendingRequest().Payload.SenderPlayerId;
                if (_playerState.TeamMembersIds.Contains(senderId))
                    _actionExecutor.AcceptCommunication(senderId);
                else
                    logger.Info("Discarded enemy request");
            }
        }

        protected (int x, int y) ConvertIndex(int i)
        {
            int x = i % _playerState.Board.SizeX;
            int y = i / _playerState.Board.SizeX;
            return (x, y);
        }

        protected List<(int x, int y)> FindPathUsingAStar(int targetX, int targetY, Func<(int x, int y), (int x, int y), int> heuristicFunc, int weight = 2)
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

            logger.Warn($"Can't find a path to {target}!");
            _playerState.PrintBoard();
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
        protected int ManhattanDistance((int x, int y) start, (int x, int y) end)
        {
            return Math.Abs(start.x - end.x) + Math.Abs(start.y - end.y);
        }

        protected bool MoveOneStep(int targetX, int targetY)
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
    }
}
