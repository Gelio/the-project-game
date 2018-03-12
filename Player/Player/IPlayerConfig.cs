using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public interface IPlayerConfig
    {
        int AskLevel { get; set; }
        int RespondLevel { get; set; }
        int Timeout { get; set; }
        string GameName { get; set; }
        string ServerHostname { get; set; }
        int ServerPort { get; set; }
    }
}
