using System;
using System.Net;
using System.Net.Sockets;
using Player.Interfaces;

namespace Player
{
    public class Communicator : ICommunicator
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private const int MAX_MSG_LEN = 10000000;
        private TcpClient _tcpClient;
        private string _serverHostName;
        private int _serverPort;

        public bool IsConnected => _tcpClient != null;
        public string ServerHostName => _serverHostName;
        public int ServerPort => _serverPort;

        public Communicator(string hostname, int port)
        {
            _serverHostName = hostname;
            _serverPort = port;
        }

        public void Connect()
        {
            _tcpClient = new TcpClient();
            try
            {
                _tcpClient.ConnectAsync(_serverHostName, _serverPort).Wait(2000);
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
            }
            if (!_tcpClient.Connected)
                throw new TimeoutException();
        }

        public void Disconnect()
        {
            _tcpClient.Close();
        }

        public void Send(string message)
        {
            var stream = _tcpClient.GetStream();

            // Encode message to byte array
            var buffer = System.Text.Encoding.UTF8.GetBytes(message);

            logger.Trace("Sending: {0}", message);

            // Send 4-byte message length
            var messageLen = BitConverter.GetBytes(IPAddress.HostToNetworkOrder((Int32)buffer.Length));
            stream.Write(messageLen, 0, 4/*messageLen.Length*/);

            // Send actual message
            stream.Write(buffer, 0, buffer.Length);
        }

        public string Receive()
        {
            var stream = _tcpClient.GetStream();
            var fourBytes = new byte[4];

            // Read the length of incoming message
            stream.Read(fourBytes, 0, 4);
            var messageLen = IPAddress.NetworkToHostOrder(BitConverter.ToInt32(fourBytes, 0));

            if (messageLen == 0)
            {
                throw new OperationCanceledException("Disconnected from communication server");
            }
            if (messageLen > MAX_MSG_LEN)
            {
                throw new OperationCanceledException("Received message was too large");
            }

            // Initialize buffer and read the actual message
            var buffer = new byte[messageLen];
            Console.WriteLine("Message Len: {0}", messageLen);

            int read = 0;
            while (read != messageLen)
            {
                read += stream.Read(buffer, read, messageLen - read);
            }

            logger.Trace("Received: {0}", System.Text.Encoding.UTF8.GetString(buffer));

            return System.Text.Encoding.UTF8.GetString(buffer);
        }
    }
}
