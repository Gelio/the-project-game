using System;
using System.Collections.Generic;
using System.Text;

namespace Player.GameObjects
{
    public class BoardSize
    {
        public int X;
        public int TaskArea;
        public int GoalArea;
        public int Y => TaskArea * 2 + GoalArea;
        public int Area => X * Y;
    }
}
