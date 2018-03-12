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
    class PlayerFactoryTests
    {
        [Test]
        public void InitializeComponentsTest()
        {
            // Give
            var fileName = "player.config.json";
            var dirPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var filePath = Path.Combine(dirPath, fileName);

            var playerFactory = new PlayerFactory(filePath);

            // read JSON directly from a file
            JObject expectedConfigObject;
            using (StreamReader file = File.OpenText(filePath))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                expectedConfigObject = (JObject)JToken.ReadFrom(reader);
            };

            // When
            var player = playerFactory.GetPlayer();

            // Then
            Assert.AreEqual(expectedConfigObject.Property("askLevel"), player.AskLevel);
            Assert.AreEqual(expectedConfigObject.Property("respondLevel"), player.RespondLevel);
            Assert.AreEqual(expectedConfigObject.Property("timeout"), player.Timeout);
            Assert.AreEqual(expectedConfigObject.Property("gameName"), player.GameName);

            Assert.AreEqual(expectedConfigObject.Property("serverHostname"), player.ServerHostName);
            Assert.AreEqual(expectedConfigObject.Property("serverPort"), player.ServerPort);
        }

    }
}
