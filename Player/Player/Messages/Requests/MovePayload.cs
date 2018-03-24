using Newtonsoft.Json;
using Player.GameObjects;
using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class MovePayload : IPayload
    {
        [JsonProperty("direction")]
        public Direction Direction;
    }
}
