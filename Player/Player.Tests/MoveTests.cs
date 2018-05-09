using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using Newtonsoft.Json;
using NUnit.Framework;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Responses;

namespace Player.Tests
{
    [TestFixture]
    class MoveTests
    {
        PlayerConfig _playerConfig;
        GameInfo _game;

        Mock<ICommunicator> _communicator;
        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;

        string Up = "up";

        [SetUp]
        public void Setup()
        {
            _communicator = new Mock<ICommunicator>();
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

            _game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
        }

        [Test]
        public void ThrowsWrongPayloadType()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<MoveResponsePayload>()).Throws(new WrongPayloadException());

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Game = _game
            };

            Assert.Throws<WrongPayloadException>(() => player.Move(Up));
        }

        [Test]
        public void MoveActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Game = _game
            };

            var result = player.Move(Up);

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

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Id = assignedPlayerId,
                X = assignedX,
                Y = assignedY,
                Game = _game
            };
            for (int i = 0; i < _game.BoardSize.X * (_game.BoardSize.GoalArea * 2 + _game.BoardSize.TaskArea); i++)
                player.Board.Add(new Tile());
            player.Board[indexBeforeMove].PlayerId = assignedPlayerId;


            var result = player.Move(direction);

            Assert.That(result, Is.True);
            Assert.That(player.Board[indexBeforeMove].PlayerId, Is.Null);
            Assert.That(player.Board[indexAfterMove].PlayerId, Is.EqualTo(assignedPlayerId));
            Assert.That(player.Board[indexAfterMove].DistanceToClosestPiece, Is.EqualTo(msg2.Payload.DistanceToPiece));
            Assert.That(player.Board[indexAfterMove].Timestamp, Is.EqualTo(msg2.Payload.TimeStamp));
            Assert.That(player.X, Is.EqualTo(newX));
            Assert.That(player.Y, Is.EqualTo(newY));
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

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Game = _game
            };

            Assert.Throws<NoPayloadException>(() => player.Move(Up));
        }

        [Test]
        public void MoveWrongDirection()
        {
            var invalidDirection = "top left";

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);

            var result = player.Move(invalidDirection);

            Assert.That(result, Is.False);
        }
    }
}
