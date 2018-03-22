using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Player.Common
{
    public class PlayerRejectedException : Exception
    {
        public PlayerRejectedException()
        {
        }

        public PlayerRejectedException(string message) : base(message)
        {
        }

        public PlayerRejectedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
