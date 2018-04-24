using System;

namespace Player.Common
{
    public class GameAlreadyFinishedException : Exception
    {
        public GameAlreadyFinishedException()
        {
        }

        public GameAlreadyFinishedException(string message) : base(message)
        {
        }

        public GameAlreadyFinishedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
