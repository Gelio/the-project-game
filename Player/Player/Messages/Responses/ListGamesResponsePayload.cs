using System.Collections.Generic;
using Player.Interfaces;
using Player.GameObjects;

namespace Player.Messages.Responses
{
    public class ListGamesResponsePayload : IPayload
    {
        public IList<Game> Games;
    }
}
