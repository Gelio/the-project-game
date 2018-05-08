using Newtonsoft.Json;
using Player.GameObjects;
using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class ListGamesPayload : IPayload
    {
        public string PayloadType()
        {
            return Common.Consts.ListGamesRequest;
        }
    }
}
