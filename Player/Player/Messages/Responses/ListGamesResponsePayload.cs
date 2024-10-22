using System.Collections.Generic;
using Player.Interfaces;
using Player.Messages.DTO;

namespace Player.Messages.Responses
{
    public class ListGamesResponsePayload : IPayload
    {
        public IList<GameInfoDTO> Games;

        public string PayloadType()
        {
            return Common.Consts.ListGamesResponse;
        }
    }
}
