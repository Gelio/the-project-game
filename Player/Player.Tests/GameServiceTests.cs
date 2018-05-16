using System.Collections.Generic;
using NUnit.Framework;
using Moq;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.GameObjects;

namespace Player.Tests
{
    [TestFixture]
    class GameServiceTests
    {
        [Test]
        public void GetsGameList()
        {
            // Give
            var mockMsg = Consts.LIST_GAMES_RESPONSE;
            var mockCommunicator = new Mock<ICommunicator>();
            mockCommunicator.Setup(x => x.Receive()).Returns(mockMsg);

            var expectedGameList = new List<GameInfo>
            {
                new GameInfo
                {
                    Name = "Default",
                    Description = "This field is for UI purposes",
                    TeamSizes = new Dictionary<string, int>()
                    {
                        { "1", 5 },
                        { "2", 5 }
                    },
                    BoardSize = new BoardSize
                    {
                        X = 40,
                        TaskArea = 40,
                        GoalArea = 2
                    },
                    MaxRounds = 5,
                    GoalLimit = 15,
                    Delays = new Delays
                    {
                        Move = 4000,
                        Pick = 1000,
                        Discover = 2500,
                        Destroy = 1000,
                        Test = 3000,
                        CommunicationRequest = 4000,
                        CommunicationAccept = 4000,
                        Place = 4000
                    }
                 },
                new GameInfo
                {
                    Name = "Quick",
                    Description = "A quick-paced game on a small field",
                    TeamSizes = new Dictionary<string, int>()
                    {
                        { "1", 3 },
                        { "2", 3 }
                    },
                    BoardSize = new BoardSize
                    {
                        X = 15,
                        TaskArea = 10,
                        GoalArea = 2
                    },
                    MaxRounds = 5,
                    GoalLimit = 10,
                    Delays = new Delays
                    {
                        Move = 2000,
                        Pick = 500,
                        Discover = 1250,
                        Destroy = 500,
                        Test = 2000,
                        CommunicationRequest = 1000,
                        CommunicationAccept = 1000,
                        Place = 1000
                    }
                 },
            };
            var service = new GameService(mockCommunicator.Object);

            // When
            var result = service.GetGamesList();

            // Then
            Assert.AreEqual(JsonConvert.SerializeObject(expectedGameList), JsonConvert.SerializeObject(result));
        }

        [Test]
        public void GetsGameListWhenEmpty()
        {
            // Give
            var mockMsg = Consts.EMPTY_LIST_GAMES_RESPONSE;
            var mockCommunicator = new Mock<ICommunicator>();
            mockCommunicator.Setup(x => x.Receive()).Returns(mockMsg);
            var service = new GameService(mockCommunicator.Object);

            // When
            var result = service.GetGamesList();

            // Then
            Assert.That(result.Count == 0);
        }
    }
}
