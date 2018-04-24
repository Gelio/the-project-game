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
                RecipientId = Guid.NewGuid().ToString(),
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
                RecipientId = Guid.NewGuid().ToString(),
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
            var assignedPlayerId = Guid.NewGuid().ToString();
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
                            LeaderId = assignedPlayerId,
                            Players = new List<string> { assignedPlayerId, "b", "c", "d" }
                        }},
                        {2, new TeamInfoDTO
                        {
                            LeaderId = "h",
                            Players = new List<string> { "e", "f", "g", "h" }
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
            var assignedPlayerId = Guid.NewGuid().ToString();
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
            var assignedPlayerId = Guid.NewGuid().ToString();
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

        [Test]
        public void RefreshBoardStateAlreadyFinishedBeforeGettingActionStatus()
        {
            _communicator.Setup(x => x.Receive()).Returns(Consts.GAME_FINISHED_RESPONSE);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object){};

            Assert.Throws<GameAlreadyFinishedException>(() => player.RefreshBoardState());
        }

        [Test]
        public void RefreshBoardStateGameAlreadyFinishedAfterGettingActionStatus()
        {
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                Consts.GAME_FINISHED_RESPONSE
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object) {};

            Assert.Throws<GameAlreadyFinishedException>(() => player.RefreshBoardState());
        }
    }
}
