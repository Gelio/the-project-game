using Newtonsoft.Json;
using Player.GameObjects;
using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class MovePayload : IPayload
    {
        [JsonProperty("direction")]
        public string Direction;


        public string PayloadType()
        {
            return Common.Consts.MoveRequest;
        }
    }
}
