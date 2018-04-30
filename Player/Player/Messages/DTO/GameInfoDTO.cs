using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages.DTO
{
    public class GameInfoDTO
    {
        public string Name;
        public string Description;
        public Dictionary<string, int> TeamSizes;
        public BoardSizeDTO BoardSize;
        // FIXME: remove `MaxRounds` as it is no longer used
        public int MaxRounds; // TODO is it still there?
        public int GoalLimit;
        public DelaysDTO Delays;

        /*
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append($"{Name} : {Description}");
            return sb.ToString();
        }
        */
    }

    public class BoardSizeDTO
    {
        public int X;
        public int TaskArea;
        public int GoalArea;
    }

    // QUESTION: is it deliberate that DelaysDTO looks just like `Delays` in GameObjects?
    public class DelaysDTO
    {
        public int Move;
        public int Pick;
        public int Discover;
        public int Destroy;
        public int Test;
        public int CommunicationRequest;
        public int CommunicationAccept;
        // FIXME: remove `TryPiece` as it no longer exists
        public int TryPiece;
    }
}
