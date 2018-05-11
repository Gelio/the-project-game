using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PlayerRejectedPayload : IPayload
    {
        public string Reason;

        public string PayloadType()
        {
            return Common.Consts.PlayerRejected;
        }
    }
}
