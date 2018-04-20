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

namespace Player.Tests
{
    [TestFixture]
    class DiscoverTests
    {
        string _assignedPlayerId;
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

            _assignedPlayerId = Guid.NewGuid().ToString();
        }

        [Test]
        public void DiscoverInvalidMessageType()
        {
            var messageReceived = new Message<DiscoveryResponsePayload>
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

            Assert.Throws<InvalidTypeReceivedException>(() => player.Discover());
        }

        [Test]
        public void DiscoverActionInvalid()
        {
            var messageReceived = new Message<ActionInvalidPayload>
            {
                Type = Common.Consts.ActionInvalid,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new ActionInvalidPayload
                {
                    Reason = "In order to hide take dis cover"
                }
            };
            _communicator.Setup(x => x.Receive()).Returns(JsonConvert.SerializeObject(messageReceived));

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            var result = player.Discover();

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

            var messageReceived = new Message<DiscoveryResponsePayload>
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

            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


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

            var result = player.Discover();

            Assert.That(result, Is.True);
            foreach (var t in tiles)
            {
                Assert.That(player.Board[t.X + _game.BoardSize.X * t.Y].DistanceToClosestPiece, Is.EqualTo(t.DistanceToClosestPiece));
                Assert.That(player.Board[t.X + _game.BoardSize.X * t.Y].Timestamp, Is.EqualTo(messageReceived.Payload.Timestamp));
                if (t.Piece)
                {
                    Assert.That(player.Board[t.X + _game.BoardSize.X * t.Y], Is.Not.Null);
                    Assert.That(player.Board[t.X + _game.BoardSize.X * t.Y].Piece.WasTested, Is.False);
                }
                else
                {
                    Assert.That(player.Board[t.X + _game.BoardSize.X * t.Y].Piece, Is.Null);
                }
            }
        }

        [Test]
        public void DiscoverNoPayload()
        {
            var messageReceived = new Message
            {
                Type = Common.Consts.DiscoveryResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = _assignedPlayerId,
            };

            Assert.Throws<NoPayloadException>(() => player.Discover());
        }

        [Test]
        public void DiscoverWrongPayload()
        {
            var messageReceived = new Message<GameStartedPayload>
            {
                Type = Common.Consts.DiscoveryResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new GameStartedPayload
                {
                    TeamInfo = new Dictionary<int, TeamInfoDTO>()
                    {
                        {1, new TeamInfoDTO
                        {
                            LeaderId = 2,
                            Players = new List<int>(){1, 2, 3, 4}
                        }},
                        {2, new TeamInfoDTO
                        {
                            LeaderId = 5,
                            Players = new List<int>(){5,6,7,8}
                        }}
                    }
                }
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = _assignedPlayerId,
                Game = _game
            };
            for (int i = 0; i < _game.BoardSize.X * (_game.BoardSize.GoalArea * 2 + _game.BoardSize.TaskArea); i++)
            {
                player.Board.Add(new Tile());
            }


            Assert.Throws<WrongPayloadException>(() => player.Discover());
        }
    }
}
