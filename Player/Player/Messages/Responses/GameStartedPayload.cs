using Player.Interfaces;
using System.Collections.Generic;

namespace Player.Messages.Responses
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
