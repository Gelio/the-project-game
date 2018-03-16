using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    public class ListGamesPayload : IPayload
    {
        public IList<Game> Games;
    }
}
