using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Player.Interfaces
{
    public class Message<T> where T : IPayload
    {
        [JsonProperty("type")]
        public string Type;
        [JsonProperty("senderId")]
        public string SenderId;
        [JsonProperty("recipientId")]
        public string RecipientId;
        [JsonProperty("payload")]
        public T Payload;
    }

    public class Message
    {
        [JsonProperty("type")]
        public string Type;
        [JsonProperty("senderId")]
        public string SenderId;
        [JsonProperty("recipientId")]
        public string RecipientId;
    }
}
