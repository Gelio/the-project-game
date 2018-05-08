using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class ActionValidPayload : IPayload
    {
        public int Delay;
        public string PayloadType()
        {
            return Common.Consts.ActionValid;
        }
    }
}
