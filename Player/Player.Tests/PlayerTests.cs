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
            string expectedMessage = @"
{
    ""type"": ""PLAYER_ACCEPTED"",
    ""senderId"": -1,
    ""recipientId"": 45645641568,
    ""payload"": {
                ""assignedPlayerId"": 5
    }}";
            _communicator.Setup(x => x.Receive()).Returns(expectedMessage);

            var playerConfigMock = new Mock<IPlayerConfig>();
            playerConfigMock.Setup(x => x.AskLevel).Returns(0);
            playerConfigMock.Setup(x => x.RespondLevel).Returns(0);
            playerConfigMock.Setup(x => x.Timeout).Returns(0);
            playerConfigMock.Setup(x => x.GameName).Returns("");

            var player = new Player(_communicator.Object, playerConfigMock.Object);

            // When
            player.ConnectToServer();

            // Then
            Assert.AreEqual(5, player.Id);
        }
    }
}
