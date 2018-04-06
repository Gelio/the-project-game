using System.Collections.Generic;
using Player.Messages.DTO;
using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class CommunicationResponsePayload : IPayload
    {
        public int TargetPlayerId;
        public bool Accepted;
        public List<TileCommunicationDTO> Board;
    }
}
