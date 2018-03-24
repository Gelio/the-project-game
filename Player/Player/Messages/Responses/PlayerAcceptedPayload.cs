using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PlayerAcceptedPayload : IPayload
    {
        public int AssignedPlayerId;
    }
}
