using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Player.Common
{
    public class InvalidTypeReceivedException : Exception
    {
        public InvalidTypeReceivedException()
        {
        }

        public InvalidTypeReceivedException(string message) : base(message)
        {
        }

        public InvalidTypeReceivedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
