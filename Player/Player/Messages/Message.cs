using Newtonsoft.Json;

namespace Player.Interfaces
{
    public class Message<T> where T : IPayload
    {
        [JsonProperty("type")]
        public string Type;
        [JsonProperty("senderId", NullValueHandling = NullValueHandling.Ignore)]
        public string SenderId;
        [JsonProperty("recipientId", NullValueHandling = NullValueHandling.Ignore)]
        public string RecipientId;
        [JsonProperty("payload", NullValueHandling = NullValueHandling.Ignore)]
        public T Payload;
    }

    public class Message
    {
        [JsonProperty("type")]
        public string Type;
        [JsonProperty("senderId", NullValueHandling = NullValueHandling.Ignore)]
        public string SenderId;
        [JsonProperty("recipientId", NullValueHandling = NullValueHandling.Ignore)]
        public string RecipientId;
    }
}
