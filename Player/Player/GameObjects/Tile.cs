using Player.GameObjects;

namespace Player.GameObjects
{
    public class Tile
    {
        public string PlayerId;
        public Piece Piece;
        public int DistanceToClosestPiece;
        public long? Timestamp;
        public bool HasCompletedGoal;
        public bool HasInfo => Timestamp != null;
    }
}
