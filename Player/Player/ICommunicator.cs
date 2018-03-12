using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public interface ICommunicator
    {
        string ServerHostName { get; }
        int ServerPort { get; }
        void Send(string message);
        string Receive();
    }
}
