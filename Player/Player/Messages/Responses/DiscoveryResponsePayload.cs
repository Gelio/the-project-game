using Player.GameObjects;
using Player.Interfaces;
using System.Collections.Generic;

namespace Player.Messages.Responses
{
    public class DiscoveryResponsePayload : IPayload
    {
        public long Timestamp;
        List<Tile> Tiles;
    }
}
