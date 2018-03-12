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

        //[Test]
        //public void ReadConfigFile()
        //{
        //    // Give

        //    var player = new Player(_communicator.Object);

        //    // When
        //    player.ReadConfigFile();




        //}

        [Test]
        public void InitializePlayer()
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
            var player = new Player(_communicator.Object);

            // When
            player.Initialize();


            // Then
            Assert.AreEqual(5, player.Id);
           
        }
    }
}
