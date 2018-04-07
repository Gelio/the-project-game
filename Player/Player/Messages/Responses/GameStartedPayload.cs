using Player.Interfaces;
using Player.Messages.DTO;
using System.Collections.Generic;

namespace Player.Messages.Responses
{
    public class GameStartedPayload : IPayload
    {
        public Dictionary<int, TeamInfoDTO> TeamInfo;
    }
}
