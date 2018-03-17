using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    public class ListGamesResponsePayload : IPayload
    {
        public IList<Game> Games;
    }
}
