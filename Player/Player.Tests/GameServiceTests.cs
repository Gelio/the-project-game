using System;
using System.Collections.Generic;
using System.Text;
using NUnit.Framework;
using Moq;
using Newtonsoft.Json;

namespace Player.Tests
{
    [TestFixture]
    class GameServiceTests
    {

        [Test]
        public void GetsGameList()
        {
            // Give
            var mockMsg = @"{

""type"": ""LIST_GAMES_RESPONSE"",

""senderId"": -3,

""payload"": {

 ""games"": [

{

""name"": ""Default"",

""description"": ""This field is for UI purposes"",

""teamSizes"": {

""1"": 5,

""2"": 5

},

""boardSize"": {

""x"": 40,

""taskArea"": 40,

""goalArea"": 2

},

""maxRounds"": 5,

""goalLimit"": 15,

""delays"": {

""move"": 4000,

""pick"": 1000,

""discover"": 2500,

""destroy"": 1000,

""test"": 3000,

""communicationRequest"": 4000,

""communicationAccept"": 4000,

""tryPiece"": 4000

}

},

{

""name"": ""Quick"",

""description"": ""A quick-paced game on a small field"",

""teamSizes"": {

""1"": 3,

""2"": 3

},

""boardSize"": {

""x"": 15,

""taskArea"": 10,

""goalArea"": 2

},

""maxRounds"": 5,

""goalLimit"": 10,

""delays"": {

""move"": 2000,

""pick"": 500,

""discover"": 1250,

""destroy"": 500,

""test"": 2000,

""communicationRequest"": 1000,

""communicationAccept"": 1000,

""tryPiece"": 1000

}

}

]

}

}";
            var mockCommunicator = new Mock<ICommunicator>();
            mockCommunicator.Setup(x => x.Receive()).Returns(mockMsg);

            var expectedGameList = new List<Game>
            {
                new Game
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
                        TryPiece = 4000
                    }
                 },
                new Game
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
                        TryPiece = 1000
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
            var mockMsg = @"{""type"": ""LIST_GAMES_RESPONSE"", ""senderId"": -3, ""payload"": {""games"": []}}";
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
