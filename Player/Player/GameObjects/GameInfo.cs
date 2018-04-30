using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Player.GameObjects
{
    public class GameInfo
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
            // NOTE: `AppendLine` may be used instead of `Append` with `\n` at the end
            sb.Append($"Title:       {Name}\n");
            sb.Append($"Description: {Description}\n");
            sb.Append($"Team sizes:  {TeamSizes.Select(x => x.Value.ToString()).Aggregate((s1, s2) => s1 + ", " + s2)}\n");
            sb.Append($"Board size:  {BoardSize.X} x {BoardSize.GoalArea * 2 + BoardSize.TaskArea}\n");
            sb.Append($"               {BoardSize.X} -- Width\n");
            sb.Append($"               {BoardSize.GoalArea} -- Goal height\n");
            sb.Append($"               {BoardSize.TaskArea} -- Task height\n");
            sb.Append($"Goal limit:  {GoalLimit}\n");

            return sb.ToString();
        }
    }
}
