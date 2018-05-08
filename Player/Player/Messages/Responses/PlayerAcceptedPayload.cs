using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PlayerAcceptedPayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.PlaceDownPieceResponse;
        }
    }
}
