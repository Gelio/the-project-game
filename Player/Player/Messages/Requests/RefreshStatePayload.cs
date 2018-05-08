using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class RefreshStatePayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.RefreshStateRequest;
        }
    }
}
