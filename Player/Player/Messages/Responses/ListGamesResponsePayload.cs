using System.Collections.Generic;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.GameObjects;

namespace Player.Messages.Responses
{
    public class ListGamesResponsePayload : IPayload
    {
        [JsonProperty("games")]
        public IList<Game> Games;
    }
}
