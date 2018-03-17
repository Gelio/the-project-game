using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public interface ICommunicator
    {
        string ServerHostName { get; }
        int ServerPort { get; }
        void Connect();
        void Send(string message);
        bool IsConnected { get; }
        string Receive();        
    }
}
