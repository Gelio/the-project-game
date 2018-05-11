using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class PlaceDownPiecePayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.PlaceDownPieceRequest;
        }
    }
}
