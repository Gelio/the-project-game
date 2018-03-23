using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    public class PlayerRejectedPayload : IPayload
    {
        public string Reason;
    }
}
