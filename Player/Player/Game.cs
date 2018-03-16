using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public class Game
    {
        public string Name;
        public string Description;
        public Dictionary<string, int> TeamSizes;
        public BoardSize BoardSize;
        public int MaxRounds;
        public int GoalLimit;
        public Delays Delays;
    }

    public class BoardSize
    {
        public int X;
        public int TaskArea;
        public int GoalArea;
    }

    public class Delays
    {
        public int Move;
        public int Pick;
        public int Discover;
        public int Destroy;
        public int Test;
        public int CommunicationRequest;
        public int CommunicationAccept;
        public int TryPiece;
    }

    
}
