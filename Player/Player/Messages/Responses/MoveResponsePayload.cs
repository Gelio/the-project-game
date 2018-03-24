using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class MoveResponsePayload : IPayload
    {
        public int DistanceToPiece;
        // long working after 2038
        public long TimeStamp;
    }
}
