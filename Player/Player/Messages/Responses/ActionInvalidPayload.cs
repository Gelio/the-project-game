using System;
using System.Collections.Generic;
using System.Text;
using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class ActionInvalidPayload : IPayload
    {
        public string Reason;
    }
}
