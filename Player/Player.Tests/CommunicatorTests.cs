using System;
using NUnit;
using NUnit.Framework;
using System.Net.Sockets;
using System.Net;
using System.Threading.Tasks;

namespace Player.Tests
{
    [TestFixture]
    class CommunicatorTests
    {
        private int _port;
        private TcpListener _server;
        private Task<TcpClient> _acceptTask;

        [SetUp]
        public void Setup()
        {
            _port = new Random().Next(49152, 65535);
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
            communicator.Connect();
            var communicatorSeenFromServer = await _acceptTask;

            // Then
            Assert.That(communicatorSeenFromServer.Connected);
        }

        [Test]
        public async Task SendsMessageToServer()
        {
            // Give
            var message = "testMessage";
            var communicator = new Communicator("localhost", _port);
            communicator.Connect();
            var communicatorSeenFromServer = await _acceptTask;
            var stream = communicatorSeenFromServer.GetStream();

            // When
            communicator.Send(message);

            byte[] fourBytes = new byte[4];
            stream.Read(fourBytes, 0, 4);
            var messageLen = IPAddress.NetworkToHostOrder(BitConverter.ToInt32(fourBytes, 0));

            byte[] buffer = new byte[messageLen];
            stream.Read(buffer, 0, messageLen);
            var result = System.Text.Encoding.UTF8.GetString(buffer);

            // Then
            Assert.That(String.Equals(message, result));
        }

        [Test]
        public async Task ReceivesMessageFromServer()
        {
            // Give
            var message = "testMessage";
            var buffer = System.Text.Encoding.UTF8.GetBytes(message);
            var messageLen = BitConverter.GetBytes(IPAddress.HostToNetworkOrder((Int32)buffer.Length));

            var communicator = new Communicator("localhost", _port);
            communicator.Connect();
            var communicatorSeenFromServer = await _acceptTask;
            var stream = communicatorSeenFromServer.GetStream();
            stream.Write(messageLen, 0, 4);
            stream.Write(buffer, 0, buffer.Length);

            // When
            var result = communicator.Receive();

            // Then
            Assert.That(String.Equals(message, result));
        }

    }
}
