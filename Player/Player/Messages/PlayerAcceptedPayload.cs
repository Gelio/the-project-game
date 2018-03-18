using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    public class PlayerAcceptedPayload : IPayload
    {
        public int AssignedPlayerId;
    }
}
