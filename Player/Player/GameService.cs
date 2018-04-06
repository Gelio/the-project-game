using Newtonsoft.Json;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.Responses;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Player
{
    public class GameService : IGameService
    {
        private ICommunicator _comm;
        private int _timeout = 5000;
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

            Task<string> task;
            try
            {
                task = Task.Run(() => _comm.Receive());
                if (!task.Wait(_timeout))
                    throw new TimeoutException($"Did not receive any message after {_timeout}ms");
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
            }
            var result = task.Result;

            var json = JsonConvert.DeserializeObject<Message<ListGamesResponsePayload>>(result);
            var gamesDto = json.Payload.Games;

            // TODO: Map GameDto list to Game list!!!!

            return gamesList;
        }
    }
}
