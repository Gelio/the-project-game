using Newtonsoft.Json;
using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class CommunicationPayload : IPayload
    {
        [JsonProperty("targetPlayerId")]
        public int? TargetPlayerId;

        [JsonProperty("senderPlayerId")]
        public int? SenderPlayerId;

    }
}
