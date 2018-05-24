using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Responses;
using System;
using System.Collections.Generic;

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
                    if (/* receivedBoard[i].TimeStamp != 0 && */ receivedBoard[i].TimeStamp > _playerState.Board.At(i).Timestamp)
                    {
                        AutoMapper.Mapper.Map(receivedBoard[i], _playerState.Board.At(i));
                    }
                }
                // PrintBoard();
            }
        }

        protected void PrintBoard()
        {
            int i = 0;
            for (int y = 0; y < _playerState.Game.BoardSize.Y; y++)
            {
                for (int x = 0; x < _playerState.Game.BoardSize.X; x++, i++)
                {
                    var character = _playerState.Board.At(i).HasInfo == false ? " " : "+";
                    Console.Write($"[{character}]");
                }
                Console.WriteLine();
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
                    logger.Debug("dx: {}, dy: {}, index: {}", dx, dy, index);
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
    }
}
