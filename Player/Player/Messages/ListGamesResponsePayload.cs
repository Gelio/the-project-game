using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Player.Messages
{
    public class ListGamesResponsePayload : IPayload
    {
        [JsonProperty("games")]
        public IList<Game> Games;
    }
}
