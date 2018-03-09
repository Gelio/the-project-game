using System;
using NUnit;
using NUnit.Framework;
using System.Net.Sockets;
using System.Net;
using System.Threading.Tasks;

namespace Player.Tests
{
    [TestFixture]
    class PlayerCommunicatorTests
    {
        private TcpListener _server;
        private Task<TcpClient> _acceptTask;
        private int _port = 12031;

        [SetUp]
        public void Setup()
        {
            _server = new TcpListener(IPAddress.Loopback, _port);
            _server.Start();
            _acceptTask = _server.AcceptTcpClientAsync();
        }

        [TearDown]
        public void TearDown()
        {
            _server.Stop();

        }

        [Test]
        public async Task ConnectsToServer()
        {
            // When
            var communicator = new Communicator("localhost", _port);
            var communicatorSeenFromServer = await _acceptTask;

            // Then
            Assert.That(communicatorSeenFromServer.Connected);

        }

        [Test]
        public async Task SendMessageSuccess()
        {
            // Give
            var message = "testMessage";

            var communicator = new Communicator("localhost", _port);

            var communicatoSeenFromServer = await _acceptTask;
            communicator.Send(message);

            var byteStream = communicatoSeenFromServer.GetStream();

            byte[] byteArray = new byte[4];
            byteStream.Read(byteArray, 0, 4);

            var messageLen = IPAddress.NetworkToHostOrder(BitConverter.ToInt32(byteArray, 0));

            byte[] buffer = new byte[messageLen];
            byteStream.Read(buffer, 0, messageLen);

            Assert.That(message == System.Text.Encoding.UTF8.GetString(buffer));

        }
    }
}
