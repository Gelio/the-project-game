using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class ResponseSentPayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.ResponseSent;
        }
    }
}
