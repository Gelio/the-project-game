using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class PickUpPiecePayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.PickupPieceRequest;
        }
    }
}
