using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Player.Messages
{
    public class Message<T> where T:IPayload
    {
        public string Type;
        public int SenderId;
        public int? RecipientId;
        public T Payload;
    }

    public class Message
    {
        public string Type;
        public int SenderId;
        public int? RecipientId;
    }
}
