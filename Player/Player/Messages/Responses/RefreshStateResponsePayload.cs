using Player.GameObjects;
using Player.Interfaces;
using System.Collections.Generic;

namespace Player.Messages.Responses
{
    public class RefreshStateResponsePayload : IPayload
    {
        public long Timestamp;
        public int CurrentPositionDistanceToClosestPiece;
        public IList<PlayerPosition> PlayerPositions;
        public int Team1Score;
        public int Team2Score;
    }
}
