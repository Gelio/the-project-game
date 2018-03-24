using Newtonsoft.Json;
using Player.Interfaces;

namespace Player.Messages.Requests
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
