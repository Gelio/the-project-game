using System;
using System.Collections.Generic;
using System.Text;
using NUnit;
using NUnit.Framework;
using Moq;


namespace Player.Tests
{
    [TestFixture]
    class PlayerTests
    {
        Mock<ICommunicator> _communicator;

        [SetUp]
        public void Setup()
        {
            _communicator = new Mock<ICommunicator>();
        }

        [Test]
        public void ConnectsToServer()
        {
            // Give
            string expectedMessage = Consts.PLAYER_ACCEPTED;
            _communicator.Setup(x => x.Receive()).Returns(expectedMessage);

            var playerConfig = new PlayerConfig
            {
                AskLevel = 10,
                RespondLevel = 10,
                Timeout = 11,
                GameName = "asdfasdf"
            };

            var player = new Player(_communicator.Object, playerConfig);

            // When
            player.ConnectToServer();

            // Then
            Assert.AreEqual(5, player.Id);
        }
    }
}
