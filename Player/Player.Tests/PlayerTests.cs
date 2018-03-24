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
                    TeamInfo = new Dictionary<int, TeamInfo>
                    {
                        {1, new TeamInfo
                            {
                                LeaderId = expectedLeaderId,
                                Players = expectedTeamMembersIds
                            }
                        },

                        {2, new TeamInfo
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
            var result = player.WaitForGameStart();

            //Then
            Assert.That(result, Is.True);
            Assert.That(player.LeaderId, Is.EqualTo(expectedLeaderId));
            Assert.That(player.TeamMembersIds, Is.EquivalentTo(expectedTeamMembersIds));
        }

        [Test]
        public void GetsChosenGameInfo()
        {
            var gamesListMessage = JsonConvert.DeserializeObject<Message<ListGamesResponsePayload>>(Consts.LIST_GAMES_RESPONSE);
            var gamesList = gamesListMessage.Payload.Games;
            _gameService.Setup(x => x.GetGamesList()).Returns(gamesList);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);
            player.GetGameInfo();

            Assert.That(player.Game, Is.Not.Null);
            Assert.That(player.Game.Name, Is.EqualTo(player.GameName));
        }

        [Test]
        public void NoChosenGameAvailable()
        {
            var gamesListMessage = JsonConvert.DeserializeObject<Message<ListGamesResponsePayload>>(Consts.EMPTY_LIST_GAMES_RESPONSE);
            var gamesList = gamesListMessage.Payload.Games;
            _gameService.Setup(x => x.GetGamesList()).Returns(gamesList);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);
            Assert.Throws<OperationCanceledException>(() => player.GetGameInfo());
        }
    }
}
