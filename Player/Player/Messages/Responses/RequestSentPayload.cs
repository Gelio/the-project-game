using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class RequestSentPayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.RequestSent;
        }
    }
}
