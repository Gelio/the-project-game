using System;
using System.Collections.Generic;
using System.Text;

namespace Player.GameObjects
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

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append($"{Name} : {Description}");
            return sb.ToString();
        }
    }
}
