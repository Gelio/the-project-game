using System;
using System.Collections.Generic;
using System.Text;
using Moq;
using Newtonsoft.Json;
using NUnit;
using NUnit.Framework;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Responses;


namespace Player.Tests
{
    [TestFixture]
    class PlayerTests
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
        public void ConnectsToServerPlayerRejectedException()
        {
            _messageProvider.Setup(x => x.AssertPlayerStatus(_playerConfig.Timeout)).Throws(new PlayerRejectedException());

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);
            Assert.Throws<PlayerRejectedException>(() => player.ConnectToServer());
        }

        [Test]
        public void WaitForGameStartEventuallySucceeds()
        {
            // Give
            var expectedTeamMembersIds = new List<string> { "a", "b", "c", "d" };
            var expectedLeaderId = "c";

            var msg3 = new Message<GameStartedPayload>
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
                                LeaderId = "h",
                                Players = new List<string> {"e", "f", "g", "h"}
                            }
                        }
                    }
                }
            };

            _messageProvider.SetupSequence(x => x.Receive<GameStartedPayload>())
                            .Throws(new WrongPayloadException())
                            .Throws(new WrongPayloadException())
                            .Returns(msg3);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);

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
                        Place = 4000
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
                        Place = 4000
                    }
                },

            };

            _gameService.Setup(x => x.GetGamesList()).Returns(gamesList);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);
            player.GetGameInfo();

            Assert.That(player.Game, Is.Not.Null);
            Assert.That(player.Game.Name, Is.EqualTo(_playerConfig.GameName));
        }

        [Test]
        public void NoChosenGameAvailable()
        {
            List<GameInfo> gamesList = new List<GameInfo>();

            _gameService.Setup(x => x.GetGamesList()).Returns(gamesList);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);
            Assert.Throws<OperationCanceledException>(() => player.GetGameInfo());
        }
    }
}
