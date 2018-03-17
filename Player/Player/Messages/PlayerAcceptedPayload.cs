using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    class PlayerAcceptedPayload : IPayload
    {
        public int AssignedPlayerId;
    }
}
