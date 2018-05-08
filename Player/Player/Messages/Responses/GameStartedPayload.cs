using System.Collections.Generic;
using Player.Interfaces;
using Player.Messages.DTO;


namespace Player.Messages.Responses
{
    public class GameStartedPayload : IPayload
    {
        public Dictionary<int, TeamInfoDTO> TeamInfo;

        public string PayloadType()
        {
            return Common.Consts.GameStarted;
        }
    }
}
