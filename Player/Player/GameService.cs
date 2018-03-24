using Newtonsoft.Json;
using Player.Interfaces;
using Player.Interfaces;
using Player.Messages.Responses;
using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public class GameService : IGameService
    {
        private ICommunicator _comm;

        public GameService(ICommunicator comm)
        {
            _comm = comm;
        }

        public IList<Game> GetGamesList()
        {
            if (!_comm.IsConnected)
            {
                _comm.Connect();
            }

            var message = new Message
            {
                Type = Common.Consts.ListGamesRequest,
                SenderId = Common.Consts.UnknownPlayerId
            };

            var msg_string = JsonConvert.SerializeObject(message);

            _comm.Send(msg_string);
            var result = _comm.Receive();

            var json = JsonConvert.DeserializeObject<Message<ListGamesResponsePayload>>(result);
            var gamesList = json.Payload.Games;

            return gamesList;
        }
    }
}
