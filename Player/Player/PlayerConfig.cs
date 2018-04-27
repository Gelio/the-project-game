using System;

namespace Player
{
    public class PlayerConfig : IEquatable<PlayerConfig>
    {
        public int AskLevel { get; set; }
        public int RespondLevel { get; set; }
        public int Timeout { get; set; }
        public string GameName { get; set; }
        public string ServerHostname { get; set; }
        public int ServerPort { get; set; }
        public bool IsLeader { get; set; }
        public int TeamNumber { get; set; }

        public bool Equals(PlayerConfig other)
        {
            return (other.AskLevel == AskLevel
                && other.GameName == GameName
                && other.IsLeader == IsLeader
                && other.RespondLevel == RespondLevel
                && other.ServerHostname == ServerHostname
                && other.ServerPort == ServerPort
                && other.TeamNumber == TeamNumber
                && other.Timeout == Timeout);
        }
    }
}
