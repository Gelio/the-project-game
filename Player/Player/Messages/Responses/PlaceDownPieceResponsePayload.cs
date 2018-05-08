using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PlaceDownPieceResponsePayload : IPayload
    {
        public bool? DidCompleteGoal;

        public string PayloadType()
        {
            return Common.Consts.PlaceDownPieceResponse;
        }
    }
}
