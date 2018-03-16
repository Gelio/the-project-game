namespace Player
{
    public class PlayerConfig : IPlayerConfig
    {
        public int AskLevel { get; set; }
        public int RespondLevel { get; set; }
        public int Timeout { get; set; }
        public string GameName { get; set; }
        public string ServerHostname { get; set; }
        public int ServerPort { get; set; }
    }
}
