using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;

namespace Player
{
    public class Communicator : ICommunicator
    {
        private TcpClient _tcpClient;
        private string _serverHostName;
        private int _serverPort;

        public string ServerHostName => _serverHostName;
        public int ServerPort => _serverPort;

        public Communicator(string hostname, int port)
        {
            _serverHostName = hostname;
            _serverPort = port;
        }

        public void Connect()
        {
            _tcpClient = new TcpClient(_serverHostName, _serverPort);
        }

        public void Send(string message)
        {
            var stream = _tcpClient.GetStream();

            // Encode message to byte array
            var buffer = System.Text.Encoding.UTF8.GetBytes(message);

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

            // Initialize buffer and read the actual message
            var buffer = new byte[messageLen];
            stream.Read(buffer, 0, messageLen);

            return System.Text.Encoding.UTF8.GetString(buffer);
        }
    }
}
