using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Interfaces
{
    public interface ICommunicator
    {
        string ServerHostName { get; }
        int ServerPort { get; }
        void Disconnect();
        void Connect();
        void Send(string message);
        bool IsConnected { get; }
        string Receive();
    }
}
