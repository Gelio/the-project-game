using System;
using Moq;
using NUnit.Framework;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.Responses;

namespace Player.Tests
{
    [TestFixture]
    class MoveTests
    {
        PlayerConfig _playerConfig;
        GameInfo _game;

        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;
        PlayerState _playerState;

        string Up = "up";

        [SetUp]
        public void Setup()
        {
            _messageProvider = new Mock<IMessageProvider>();
            _playerConfig = new PlayerConfig
            {
                AskLevel = 10,
                RespondLevel = 10,
                Timeout = 11,
                GameName = "Default",
                TeamNumber = 1
            };
            _gameService = new Mock<IGameService>();
            _playerState = new PlayerState(_playerConfig);

            _game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            _playerState.Game = _game;
            _playerState.Board = new Board(_game.BoardSize);
        }

        [Test]
        public void ThrowsWrongPayloadType()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<MoveResponsePayload>()).Throws(new WrongPayloadException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<WrongPayloadException>(() => actionExecutor.Move(Up));
        }

        [Test]
        public void MoveActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.Move(Up);

            Assert.That(result, Is.False);
        }

        [TestCase("up")]
        [TestCase("down")]
        [TestCase("left")]
        [TestCase("right")]
        public void MoveSuccess(string direction)
        {
            var assignedPlayerId = Guid.NewGuid().ToString();

            var assignedX = 1;
            var assignedY = 1;
            int indexBeforeMove = assignedX + _game.BoardSize.X * assignedY;

            int newX = assignedX;
            int newY = assignedY;
            switch (direction)
            {
                case "up":
                    newY -= 1;
                    break;
                case "down":
                    newY += 1;
                    break;
                case "left":
                    newX -= 1;
                    break;
                case "right":
                    newX += 1;
                    break;
            }
            int indexAfterMove = newX + _game.BoardSize.X * newY;

            var msg2 = new Message<MoveResponsePayload>
            {
                Type = Common.Consts.MoveResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId,
                Payload = new MoveResponsePayload
                {
                    DistanceToPiece = 5,
                    TimeStamp = 10
                }
            };
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<MoveResponsePayload>()).Returns(msg2);

            _playerState.X = assignedX;
            _playerState.Y = assignedY;
            _playerState.Id = assignedPlayerId;
            _playerState.Board.At(indexBeforeMove).PlayerId = assignedPlayerId;

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.Move(direction);

            Assert.That(result, Is.True);
            Assert.That(_playerState.Board.At(indexBeforeMove).PlayerId, Is.Null);
            Assert.That(_playerState.Board.At(indexAfterMove).PlayerId, Is.EqualTo(assignedPlayerId));
            Assert.That(_playerState.Board.At(indexAfterMove).DistanceToClosestPiece, Is.EqualTo(msg2.Payload.DistanceToPiece));
            Assert.That(_playerState.Board.At(indexAfterMove).Timestamp, Is.EqualTo(msg2.Payload.TimeStamp));
            Assert.That(_playerState.X, Is.EqualTo(newX));
            Assert.That(_playerState.Y, Is.EqualTo(newY));
        }

        [Test]
        public void MoveNoPayload()
        {
            var msg2 = new Message<MoveResponsePayload>
            {
                Type = Common.Consts.MoveResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = Guid.NewGuid().ToString(),
                Payload = null
            };
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<MoveResponsePayload>()).Returns(msg2);

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<NoPayloadException>(() => actionExecutor.Move(Up));
        }

        [Test]
        public void MoveWrongDirection()
        {
            var invalidDirection = "top left";

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.Move(invalidDirection);

            Assert.That(result, Is.False);
        }
    }
}
