using Player.GameObjects;
using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class CommunicationResponsePayload : IPayload
    {
        public int TargetPlayerId;
        public bool Accepted;
        public Board Board;
    }
}
