using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Responses;
using System;

namespace Player.Strategy
{
    public abstract class AbstractStrategy
    {
        protected PlayerState _playerState;
        protected IActionExecuter _actionExecuter;
        protected static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public AbstractStrategy(PlayerState playerState, IActionExecuter actionExecuter)
        {
            _playerState = playerState;
            _actionExecuter = actionExecuter;
        }

        public abstract void Play();

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
            for (int y = 0; y < 2 * _playerState.Game.BoardSize.GoalArea + _playerState.Game.BoardSize.TaskArea; y++)
            {
                for (int x = 0; x < _playerState.Game.BoardSize.X; x++, i++)
                {
                    var character = _playerState.Board.At(i).HasInfo == false ? " " : "+";
                    Console.Write($"[{character}]");
                }
                Console.WriteLine();
            }
        }

        protected void RoundFinished(string receivedMessageSerialized)
        {
            var received = JsonConvert.DeserializeObject<Message<GameFinishedPayload>>(receivedMessageSerialized);
            var winnerTeam = (received.Payload.Team1Score > received.Payload.Team2Score) ? "Team 1" : "Team 2";
            string message = $"Scores:\n\tTeam 1: {received.Payload.Team1Score}\n\tTeam 2: {received.Payload.Team2Score}\n" +
                $"Congratulations {winnerTeam}! WOOP WOOP!\n";
            logger.Info(message);
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
                endY = (_playerState.Game.BoardSize.GoalArea * 2) + _playerState.Game.BoardSize.TaskArea;
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
            for (int dy = -1; dy <= 1; dy++)
                for (int dx = -1; dx <= 1; dx++)
                {
                    if (_playerState.X + dx < 0 || _playerState.X + dx >= _playerState.Game.BoardSize.X || _playerState.Y + dy < 0 || _playerState.Y + dy >= (_playerState.Game.BoardSize.TaskArea + _playerState.Game.BoardSize.GoalArea * 2))
                        continue;
                    int index = _playerState.X + dx + _playerState.Game.BoardSize.X * (_playerState.Y + dy);
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
