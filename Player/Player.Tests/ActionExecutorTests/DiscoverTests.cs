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
    class DiscoverTests
    {
        string _assignedPlayerId;
        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;
        PlayerState _playerState;

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
            _assignedPlayerId = Guid.NewGuid().ToString();
            _playerState.Game = _game;
            _playerState.Id = _assignedPlayerId;
            _playerState.Board = new Board(_game.BoardSize);
        }

        [Test]
        public void DiscoverActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.Discover();

            Assert.That(result, Is.False);
        }

        [Test]
        public void DiscoverSuccess()
        {
            var assignedX = 0;
            var assignedY = 0;
            var tile1 = new TileDiscoveryDTO
            {
                X = 0,
                Y = 0,
                DistanceToClosestPiece = 11,
                Piece = false,
            };

            var tile2 = new TileDiscoveryDTO
            {
                X = 1,
                Y = 0,
                DistanceToClosestPiece = 10,
                Piece = false,
            };

            var tile3 = new TileDiscoveryDTO
            {
                X = 2,
                Y = 0,
                DistanceToClosestPiece = 0,
                Piece = true,
            };

            var tiles = new List<TileDiscoveryDTO>
            {
                tile1, tile2, tile3
            };

            var msg = new Message<DiscoveryResponsePayload>
            {
                Type = Common.Consts.DiscoveryResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new DiscoveryResponsePayload
                {
                    Timestamp = 69,
                    Tiles = tiles
                }
            };

            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<DiscoveryResponsePayload>()).Returns(msg);
            _playerState.X = assignedX;
            _playerState.Y = assignedY;

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.Discover();

            Assert.That(result, Is.True);
            foreach (var t in tiles)
            {
                Assert.That(_playerState.Board.At(t.X, t.Y).DistanceToClosestPiece, Is.EqualTo(t.DistanceToClosestPiece));
                Assert.That(_playerState.Board.At(t.X, t.Y).Timestamp, Is.EqualTo(msg.Payload.Timestamp));
                if (t.Piece)
                {
                    Assert.That(_playerState.Board.At(t.X, t.Y), Is.Not.Null);
                    Assert.That(_playerState.Board.At(t.X, t.Y).Piece.WasTested, Is.False);
                }
                else
                {
                    Assert.That(_playerState.Board.At(t.X, t.Y).Piece, Is.Null);
                }
            }
        }

        [Test]
        public void DiscoverNoPayload()
        {
            var msg = new Message<DiscoveryResponsePayload>
            {
                Type = Common.Consts.DiscoveryResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = null
            };

            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<DiscoveryResponsePayload>()).Returns(msg);

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<NoPayloadException>(() => actionExecutor.Discover());
        }

        [Test]
        public void DiscoverWrongPayload()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<DiscoveryResponsePayload>()).Throws(new WrongPayloadException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<WrongPayloadException>(() => actionExecutor.Discover());
        }

        [Test]
        public void DiscoverGameAlreadyFinishedBeforeGettingActionStatus()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new GameAlreadyFinishedException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<GameAlreadyFinishedException>(() => actionExecutor.Discover());
        }

        [Test]
        public void DiscoverGameAlreadyFinishedAfterGettingActionStatus()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<DiscoveryResponsePayload>()).Throws(new GameAlreadyFinishedException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<GameAlreadyFinishedException>(() => actionExecutor.Discover());
        }
    }
}
