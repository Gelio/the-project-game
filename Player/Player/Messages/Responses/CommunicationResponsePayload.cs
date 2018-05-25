using System.Collections.Generic;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.Messages.DTO;


namespace Player.Messages.Responses
{
    public class CommunicationResponsePayload : IPayload
    {
        [JsonProperty("senderPlayerId", NullValueHandling = NullValueHandling.Ignore)]
        public string SenderPlayerId;

        [JsonProperty("targetPlayerId", NullValueHandling = NullValueHandling.Ignore)]
        public string TargetPlayerId;

        [JsonProperty("accepted")]
        public bool Accepted;

        [JsonProperty("board")]
        public List<TileCommunicationDTO> Board;

        public string PayloadType()
        {
            return Common.Consts.CommunicationResponse;
        }
    }
}
