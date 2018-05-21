using System.Collections.Generic;
using Newtonsoft.Json;

namespace Player.Messages.DTO
{
    public class TileCommunicationDTO
    {
        [JsonProperty("distanceToPiece")]
        public int DistanceToPiece;

        [JsonProperty("hasCompletedGoal")]
        public bool HasCompletedGoal;

        [JsonProperty("piece")]
        public PieceDTO Piece;

        [JsonProperty("playerId")]
        public string PlayerId;

        [JsonProperty("timestamp")]
        public long TimeStamp;
    }

    public class PieceDTO
    {
        [JsonProperty("isSham")]
        public bool IsSham;

        [JsonProperty("wasTested")]
        public bool WasTested;
    }
}
