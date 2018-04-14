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
    class RefreshStateBoardTests
    {
        Mock<ICommunicator> _communicator;
        PlayerConfig _playerConfig;
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

        }

        [Test]
        public void RefreshBoardStateInvalidMessageType()
        {
            var messageReceived = new Message<RefreshStateResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = 1,
                Type = Consts.EMPTY_LIST_GAMES_RESPONSE
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            Assert.Throws<InvalidTypeReceivedException>(() => player.RefreshBoardState());
        }

        [Test]
        public void RefreshBoardStateActionInvalid()
        {
            var messageReceived = new Message<ActionInvalidPayload>
            {
                Type = Common.Consts.ActionInvalid,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = 1,
                Payload = new ActionInvalidPayload
                {
                    Reason = "Drink fresh b4 you re-fresh"
                }
            };
            _communicator.Setup(x => x.Receive()).Returns(JsonConvert.SerializeObject(messageReceived));

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            var result = player.RefreshBoardState();

            Assert.That(result, Is.False);
        }

        [Test]
        public void RefreshBoardStateWrongPayload()
        {
            var assignedPlayerId = 1;
            var messageReceived = new Message<GameStartedPayload>
            {
                Type = Common.Consts.RefreshStateResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId,
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

            var game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = assignedPlayerId,
                Game = game
            };
            for (int i = 0; i < game.BoardSize.X * (game.BoardSize.GoalArea * 2 + game.BoardSize.TaskArea); i++)
            {
                player.Board.Add(new Tile());
            }


            Assert.Throws<WrongPayloadException>(() => player.RefreshBoardState());
        }

        [Test]
        public void RefreshBoardStateNoPayload()
        {
            var assignedPlayerId = 1;
            var messageReceived = new Message
            {
                Type = Common.Consts.RefreshStateResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = assignedPlayerId,
            };

            Assert.Throws<NoPayloadException>(() => player.RefreshBoardState());
        }

        [Test]
        public void RefreshBoardStateNoPlayerId()
        {
            var assignedPlayerId = 1;
            var messageReceived = new Message<RefreshStateResponsePayload>
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
                            PlayerId=assignedPlayerId + 1,
                            X=10,
                            Y=10
                        },
                        new PlayerPositionDTO
                        {
                            PlayerId=assignedPlayerId + 2,
                            X=20,
                            Y=20
                        }
                    }
                }
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)

            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
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
            var assignedPlayerId = 1;

            var playerPos1 = new PlayerPositionDTO
            {
                PlayerId = assignedPlayerId,
                X = 10,
                Y = 10
            };

            var playerPos2 = new PlayerPositionDTO
            {
                PlayerId = assignedPlayerId +2,
                X = 20,
                Y = 20
            };

            var playerPositions = new List<PlayerPositionDTO>
            {
                playerPos1, playerPos2
            };

            var messageReceived = new Message<RefreshStateResponsePayload>
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
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)

            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
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
            Assert.That(player.Board.FirstOrDefault(x => x.PlayerId == assignedPlayerId).DistanceToClosestPiece, Is.EqualTo(messageReceived.Payload.CurrentPositionDistanceToClosestPiece));
            Assert.That(player.X, Is.EqualTo(playerPos1.X));
            Assert.That(player.Y, Is.EqualTo(playerPos1.Y));

            foreach (var p in playerPositions)
            {
                Assert.That(player.Board[p.X + game.BoardSize.X * p.Y].PlayerId, Is.EqualTo(p.PlayerId));
                Assert.That(player.Board[p.X + game.BoardSize.X * p.Y].Timestamp, Is.EqualTo(messageReceived.Payload.Timestamp));
            }            
        }

    }
}
