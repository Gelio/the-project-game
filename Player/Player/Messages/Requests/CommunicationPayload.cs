using Newtonsoft.Json;
using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class CommunicationPayload : IPayload
    {
        [JsonProperty("targetPlayerId")]
        public string TargetPlayerId;

        [JsonProperty("senderPlayerId")]
        public string SenderPlayerId;

    }
}
