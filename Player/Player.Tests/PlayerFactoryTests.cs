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
        public void InitializeComponents()
        {
            // Give
            var fileName = "player.config.json";
            var dirPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var filePath = Path.Combine(dirPath, fileName);

            var playerFactory = new PlayerFactory(filePath);

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

    }
}
