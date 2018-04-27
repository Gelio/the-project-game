using Player.GameObjects;

namespace Player.GameObjects
{
    public class Tile
    {
        public string PlayerId;
        public Piece Piece;
        public int DistanceToClosestPiece;
        public long? Timestamp;
        public GoalStatusEnum GoalStatus;
        public bool HasInfo => Timestamp != null;
    }

    public enum GoalStatusEnum
    {
        NoInfo = 0,
        NoGoal,
        CompletedGoal
    }
}
