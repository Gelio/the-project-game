using System;
using System.Collections.Generic;
using NUnit.Framework;
using Moq;
using Player.Common;
using Player.Interfaces;
using Newtonsoft.Json;
using Player.Messages.Responses;
using Player.Messages.DTO;
using Player.GameObjects;
using System.Linq;

namespace Player.Tests.PieceTests
{
    [TestFixture]
    class PickUpPieceTests
    {
        static string _assignedPlayerId = Guid.NewGuid().ToString();
        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<ICommunicator> _communicator;
        Mock<IGameService> _gameService;

        [SetUp]
        public void Setup()
        {
            _communicator = new Mock<ICommunicator>();
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
        public void PickUpPieceSuccess()
        {
            var assignedX = 12;
            var assignedY = 3;

            var receivedMessage = new Message<PickUpPieceResponsePayload>()
            {
                Type = Common.Consts.PickupPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new PickUpPieceResponsePayload()
            };

            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(receivedMessage)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            // ------------------------

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = _assignedPlayerId,
                X = assignedX,
                Y = assignedY,
                Game = _game
            };

            for (int i = 0; i < _game.BoardSize.X * (_game.BoardSize.GoalArea * 2 + _game.BoardSize.TaskArea); i++)
            {
                player.Board.Add(new Tile());
            }
            player.Board[player.X + player.Game.BoardSize.X * player.Y].Piece = new Piece();
            var result = player.PickUpPiece();

            // ------------------------

            Assert.That(result, Is.True);
            Assert.That(player.HeldPiece, Is.Not.Null);
            Assert.That(player.Board[player.X + player.Game.BoardSize.X * player.Y].Piece, Is.Null);
        }

        [Test]
        public void PickUpPieceActionInvalid()
        {
            var messageReceived = new Message<ActionInvalidPayload>
            {
                Type = Common.Consts.ActionInvalid,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new ActionInvalidPayload
                {
                    Reason = "pick-up line too cheezy"
                }
            };
            _communicator.Setup(x => x.Receive()).Returns(JsonConvert.SerializeObject(messageReceived));

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            var result = player.PickUpPiece();

            Assert.That(result, Is.False);
        }

        [Test]
        public void PickUpPieceInvalidMessageType()
        {
            var messageReceived = new Message<PickUpPieceResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Type = Consts.EMPTY_LIST_GAMES_RESPONSE
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            Assert.Throws<InvalidTypeReceivedException>(() => player.PickUpPiece());
        }
    }
}
