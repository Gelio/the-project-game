using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class PlaceDownPieceResponsePayload : IPayload
    {
        public bool? DidCompleteGoal;
    }
}
