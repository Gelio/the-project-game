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
        public int SenderId;
        [JsonProperty("recipientId")]
        public int? RecipientId;
        [JsonProperty("payload")]
        public T Payload;
    }

    public class Message
    {
        [JsonProperty("type")]
        public string Type;
        [JsonProperty("senderId")]
        public int SenderId;
        [JsonProperty("recipientId")]
        public int? RecipientId;
    }
}
