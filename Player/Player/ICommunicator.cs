using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public interface ICommunicator
    {
        void Send(string message);
        string Receive();
    }
}
