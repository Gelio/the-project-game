using System;
using System.Collections.Generic;
using System.Text;
using NUnit.Framework;
using Moq;
using System.IO;
using System.Reflection;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Player.Tests
{
    [TestFixture]
    class PlayerServiceTests
    {
        [Test]
        public void InitializeComponents()
        {
            // Give
            var fileName = "player.config.json";
            var dirPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var filePath = Path.Combine(dirPath, fileName);

            var playerFactory = new PlayerService(filePath);

            PlayerConfig expectedConfigObject;
            using (StreamReader file = File.OpenText(filePath))
            {
                JsonSerializer serializer = new JsonSerializer();
                expectedConfigObject = (PlayerConfig)serializer.Deserialize(file, typeof(PlayerConfig));
            };

            // When
            var player = playerFactory.GetPlayer();

            // Then
            Assert.AreEqual(expectedConfigObject.AskLevel, player.AskLevel);
            Assert.AreEqual(expectedConfigObject.RespondLevel, player.RespondLevel);
            Assert.AreEqual(expectedConfigObject.Timeout, player.Timeout);
            Assert.AreEqual(expectedConfigObject.GameName, player.GameName);

            Assert.AreEqual(expectedConfigObject.ServerHostname, player.ServerHostName);
            Assert.AreEqual(expectedConfigObject.ServerPort, player.ServerPort);
        }

        [Test]
        public void GetsGameList()
        {
            // Give
            var configFilePath = "";
            var service = new PlayerService(configFilePath);
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
                        Discover = 500,
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

            // When
            var result = service.GetGamesList();

            // Then
            Assert.That(result == expectedGameList);

        }

        [Test]
        public void GetsGameListWhenEmpty()
        {
            // Give
            var configFilePath = "";
            var service = new PlayerService(configFilePath);

            // When
            var result = service.GetGamesList();

            // Then
            Assert.That(result.Count == 0);
        }
    }
}
