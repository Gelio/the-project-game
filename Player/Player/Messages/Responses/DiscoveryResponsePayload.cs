using Player.Messages.DTO;
using Player.Interfaces;
using System.Collections.Generic;

namespace Player.Messages.Responses
{
    public class DiscoveryResponsePayload : IPayload
    {
        public long Timestamp;
        public List<TileDiscoveryDTO> Tiles;
    }
}
