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
    class RefreshStateBoardTests
    {
        Mock<ICommunicator> _communicator;
        PlayerConfig _playerConfig;
        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;

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
            _messageProvider = new Mock<IMessageProvider>();
        }


        [Test]
        public void RefreshBoardStateActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);

            var result = player.RefreshBoardState();

            Assert.That(result, Is.False);
        }

        [Test]
        public void RefreshBoardStateNoPayload()
        {
            var assignedPlayerId = Guid.NewGuid().ToString();
            var msg2 = new Message<RefreshStateResponsePayload>
            {
                Type = Common.Consts.RefreshStateResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId,
                Payload = null
            };

            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<RefreshStateResponsePayload>()).Returns(msg2);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Id = assignedPlayerId,
            };

            Assert.Throws<NoPayloadException>(() => player.RefreshBoardState());
        }

        [Test]
        public void RefreshBoardStateNoPlayerId()
        {
            var assignedPlayerId = Guid.NewGuid().ToString();
            var msg2 = new Message<RefreshStateResponsePayload>
            {
                Type = Common.Consts.RefreshStateResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId,
                Payload = new RefreshStateResponsePayload
                {
                    CurrentPositionDistanceToClosestPiece = 10,
                    Team1Score = 5,
                    Team2Score = 6,
                    Timestamp = 123,
                    PlayerPositions = new List<PlayerPositionDTO>
                    {
                        new PlayerPositionDTO
                        {
                            PlayerId="xxx",
                            X=10,
                            Y=10
                        },
                        new PlayerPositionDTO
                        {
                            PlayerId="yyy",
                            X=20,
                            Y=20
                        }
                    }
                }
            };
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<RefreshStateResponsePayload>()).Returns(msg2);

            var game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Id = assignedPlayerId,
                Game = game
            };
            for (int i = 0; i < game.BoardSize.X * (game.BoardSize.GoalArea * 2 + game.BoardSize.TaskArea); i++)
            {
                player.Board.Add(new Tile());
            }

            Assert.Throws<InvalidOperationException>(() => player.RefreshBoardState());
        }

        [Test]
        public void RefreshBoardStateSuccess()
        {
            var assignedPlayerId = Guid.NewGuid().ToString();

            var playerPos1 = new PlayerPositionDTO
            {
                PlayerId = assignedPlayerId,
                X = 10,
                Y = 10
            };

            var playerPos2 = new PlayerPositionDTO
            {
                PlayerId = Guid.NewGuid().ToString(),
                X = 20,
                Y = 20
            };

            var playerPositions = new List<PlayerPositionDTO>
            {
                playerPos1, playerPos2
            };

            var msg2 = new Message<RefreshStateResponsePayload>
            {
                Type = Common.Consts.RefreshStateResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId,
                Payload = new RefreshStateResponsePayload
                {
                    CurrentPositionDistanceToClosestPiece = 10,
                    Team1Score = 5,
                    Team2Score = 6,
                    Timestamp = 123,
                    PlayerPositions = playerPositions
                }
            };
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<RefreshStateResponsePayload>()).Returns(msg2);


            var game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Id = assignedPlayerId,
                Game = game
            };
            for (int i = 0; i < game.BoardSize.X * (game.BoardSize.GoalArea * 2 + game.BoardSize.TaskArea); i++)
            {
                player.Board.Add(new Tile());
            }

            var result = player.RefreshBoardState();

            Assert.That(result, Is.True);
            Assert.That(player.Board.FirstOrDefault(x => x.PlayerId == assignedPlayerId).DistanceToClosestPiece, Is.EqualTo(msg2.Payload.CurrentPositionDistanceToClosestPiece));
            Assert.That(player.X, Is.EqualTo(playerPos1.X));
            Assert.That(player.Y, Is.EqualTo(playerPos1.Y));

            foreach (var p in playerPositions)
            {
                Assert.That(player.Board[p.X + game.BoardSize.X * p.Y].PlayerId, Is.EqualTo(p.PlayerId));
                Assert.That(player.Board[p.X + game.BoardSize.X * p.Y].Timestamp, Is.EqualTo(msg2.Payload.Timestamp));
            }
        }
    }
}
