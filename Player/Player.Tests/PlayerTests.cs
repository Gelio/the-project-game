using System;
using System.Collections.Generic;
using System.Text;
using NUnit;
using NUnit.Framework;
using Moq;
using Player.Common;
using Player.Interfaces;
using Newtonsoft.Json;
using Player.Messages.Responses;
using Player.Messages.DTO;
using Player.GameObjects;

namespace Player.Tests
{
    [TestFixture]
    class PlayerTests
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
        public void ConnectsToServer()
        {
            // Give
            string expectedMessage = Consts.PLAYER_ACCEPTED;
            _communicator.Setup(x => x.Receive()).Returns(expectedMessage);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            // When
            player.ConnectToServer();

            // Then
            Assert.AreEqual(5, player.Id);
        }

        [Test]
        public void ConnectsToServerPlayerRejectedException()
        {
            // Give
            string expectedMessage = Consts.PLAYER_REJECTED;
            _communicator.Setup(x => x.Receive()).Returns(expectedMessage);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            Assert.Throws<PlayerRejectedException>(() => player.ConnectToServer());
        }

        [Test]
        public void WaitForGameStartSucceeds()
        {
            // Give
            var expectedTeamMembersIds = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8 };
            var expectedLeaderId = 3;
            var message = new Message<GameStartedPayload>
            {
                Type = Common.Consts.GameStarted,
                Payload = new GameStartedPayload
                {
                    TeamInfo = new Dictionary<int, TeamInfoDTO>
                    {
                        {1, new TeamInfoDTO
                            {
                                LeaderId = expectedLeaderId,
                                Players = expectedTeamMembersIds
                            }
                        },

                        {2, new TeamInfoDTO
                            {
                                LeaderId = 9,
                                Players = new List<int> {9,10,11,12}
                            }
                        }
                    }
                }
            };
            string expectedMessage = JsonConvert.SerializeObject(message);
            _communicator.Setup(x => x.Receive()).Returns(expectedMessage);
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            // When
            player.WaitForGameStart();

            //Then
            Assert.That(player.LeaderId, Is.EqualTo(expectedLeaderId));
            Assert.That(player.TeamMembersIds, Is.EquivalentTo(expectedTeamMembersIds));
        }

        [Test]
        public void GetsChosenGameInfo()
        {
            // TODO Setup `_gameService.GetGamesList()` to return List<Game> object instead of DTO
            List<GameInfo> gamesList = new List<GameInfo>
            {
                new GameInfo
                {
                    Name = "Default",
                    Description = "Desc",

                    TeamSizes = new Dictionary<string, int>()
                    {
                        { "1", 3 },
                        { "2", 4 }
                    },
                    BoardSize = new BoardSize
                    {
                        X = 40,
                        GoalArea = 2,
                        TaskArea = 40
                    },
                    MaxRounds = 5,
                    GoalLimit = 15,
                    Delays = new Delays
                    {
                        Move = 4000,
                        Pick = 100,
                        Discover = 2500,
                        Destroy = 1000,
                        Test = 3000,
                        CommunicationAccept = 4000,
                        CommunicationRequest = 4000,
                        TryPiece = 4000
                    }
                },
                new GameInfo
                {
                    Name = "Default2",
                    Description = "Desc2",

                    TeamSizes = new Dictionary<string, int>()
                    {
                        { "1", 32 },
                        { "2", 42 }
                    },
                    BoardSize = new BoardSize
                    {
                        X = 40,
                        GoalArea = 2,
                        TaskArea = 40
                    },
                    MaxRounds = 5,
                    GoalLimit = 15,
                    Delays = new Delays
                    {
                        Move = 4000,
                        Pick = 100,
                        Discover = 2500,
                        Destroy = 1000,
                        Test = 3000,
                        CommunicationAccept = 4000,
                        CommunicationRequest = 4000,
                        TryPiece = 4000
                    }
                },

            };

            _gameService.Setup(x => x.GetGamesList()).Returns(gamesList);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);
            player.GetGameInfo();

            Assert.That(player.Game, Is.Not.Null);
            Assert.That(player.Game.Name, Is.EqualTo(player.GameName));
        }

        [Test]
        public void NoChosenGameAvailable()
        {
            List<GameInfo> gamesList = new List<GameInfo>();

            _gameService.Setup(x => x.GetGamesList()).Returns(gamesList);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);
            Assert.Throws<OperationCanceledException>(() => player.GetGameInfo());
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
    }
}
