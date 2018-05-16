using Player.GameObjects;

namespace Player.GameObjects
{
    public class Tile
    {
        public string PlayerId;
        public Piece Piece;
        public int DistanceToClosestPiece;
        public long Timestamp;
        public GoalStatusEnum GoalStatus;
        public bool HasInfo => Timestamp != 0;

        public Tile()
        {
            DistanceToClosestPiece = -1;
            GoalStatus = GoalStatusEnum.NoInfo;
        }
    }

    public enum GoalStatusEnum
    {
        NoInfo = 0,
        NoGoal,
        CompletedGoal
    }
}
