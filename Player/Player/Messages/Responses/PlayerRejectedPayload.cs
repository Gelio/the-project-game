using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PlayerRejectedPayload : IPayload
    {
        public string Reason;
    }
}
