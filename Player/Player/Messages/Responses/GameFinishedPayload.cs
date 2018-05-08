using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class GameFinishedPayload : IPayload
    {
        public int Team1Score;
        public int Team2Score;

        public string PayloadType()
        {
            return Common.Consts.GameFinished;
        }
    }
}
