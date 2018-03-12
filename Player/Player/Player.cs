using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public class Player
    {
        public int Id;
        public int TeamId;
        public bool IsLeader;
        public string GameName;

        private ICommunicator _communicator;

        public Player(ICommunicator communicator)
        {
            _communicator = communicator;
        }

        public void Initialize()
        {
            throw new NotImplementedException("lol");
        }
    }
}
