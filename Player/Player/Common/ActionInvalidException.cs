using System;

namespace Player.Common
{
    public class ActionInvalidException : Exception
    {
        public ActionInvalidException()
        {
        }

        public ActionInvalidException(string message) : base(message)
        {
        }

        public ActionInvalidException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
