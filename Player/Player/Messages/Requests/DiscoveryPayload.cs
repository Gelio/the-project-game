using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class DiscoveryPayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.DiscoveryRequest;
        }
    }
}
