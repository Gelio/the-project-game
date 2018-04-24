using System;

namespace Player.Common
{
    public class WrongPayloadException : Exception
    {
        public WrongPayloadException()
        {
        }

        public WrongPayloadException(string message) : base(message)
        {
        }

        public WrongPayloadException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
