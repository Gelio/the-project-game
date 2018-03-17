using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    public class PlayerHelloPayload : IPayload
    {
        public string Game;
        public int TeamId;
        public bool IsLeader;
        public int TemporaryId;
    }
}
