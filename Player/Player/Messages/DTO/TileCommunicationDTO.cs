using System.Collections.Generic;

namespace Player.Messages.DTO
{
    public class TileCommunicationDTO
    {
        public int DistanceToPiece;
        public bool HasCompletedGoal;
        public PieceDTO Piece;
        public int? PlayerId;
        public long TimeStamp;
    }

    public class PieceDTO
    {
        public bool IsSham;
        public bool WasTested;
    }
}
