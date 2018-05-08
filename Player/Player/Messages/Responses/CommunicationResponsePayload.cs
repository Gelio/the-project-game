using System.Collections.Generic;
using Player.Messages.DTO;
using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class CommunicationResponsePayload : IPayload
    {
        public string TargetPlayerId;
        public bool Accepted;
        public List<TileCommunicationDTO> Board;

        public string PayloadType()
        {
            return Common.Consts.CommunicationResponse;
        }
    }
}
