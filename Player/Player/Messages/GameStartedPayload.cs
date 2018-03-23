using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Messages
{
    public class GameStartedPayload : IPayload
    {
        public IDictionary<int, TeamInfo> TeamInfo;
    }

    public class TeamInfo
    {
        public IList<int> Players;
        public int LeaderId;
    }
}
