using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PickUpPieceResponsePayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.PickupPieceResponse;
        }
    }
}
