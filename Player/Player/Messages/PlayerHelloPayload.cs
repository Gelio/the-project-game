using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Player.Messages
{
    public class PlayerHelloPayload : IPayload
    {
        [JsonProperty("game")]
        public string Game;
        [JsonProperty("teamId")]
        public int TeamId;
        [JsonProperty("isLeader")]
        public bool IsLeader;
        [JsonProperty("temporaryId")]
        public int TemporaryId;
    }
}
