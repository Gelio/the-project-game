using Newtonsoft.Json;
using Player.Messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public class GameService
    {
        private ICommunicator _comm;

        public GameService(ICommunicator comm)
        {
            _comm = comm;
        }

        public IList<Game> GetGamesList()
        {
            var message = new Message
            {
                Type = Common.Consts.ListGamesResponse,
                SenderId = Common.Consts.UnknownPlayerId
            };

            var msg_string = JsonConvert.SerializeObject(message);

            _comm.Send(msg_string);
            var result = _comm.Receive();

            var json = JsonConvert.DeserializeObject<Message<ListGamesPayload>>(result);
            var gamesList = json.Payload.Games;

            return gamesList;
        }
    }
}
