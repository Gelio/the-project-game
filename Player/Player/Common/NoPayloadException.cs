using System;

namespace Player.Common
{
    public class NoPayloadException : Exception
    {
        public NoPayloadException()
        {
        }

        public NoPayloadException(string message) : base(message)
        {
        }

        public NoPayloadException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
