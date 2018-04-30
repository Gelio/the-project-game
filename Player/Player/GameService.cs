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
        /**
        NOTE: it would ensure more refactoring safety if those fields were marked as `readonly`

        The same applies to every other property that should be `readonly`.
         */
        private ICommunicator _comm;
        private int _timeout = 5000;
        public GameService(ICommunicator comm)
        {
            _comm = comm;
        }

        public IList<GameInfo> GetGamesList()
        {
            if (!_comm.IsConnected)
            {
                _comm.Connect();
            }

            var message = new Message
            {
                Type = Common.Consts.ListGamesRequest,
                SenderId = Common.Consts.UnregisteredPlayerId
            };

            // FIXME: inconsistent variable name `msg_string`
            var msg_string = JsonConvert.SerializeObject(message);
            /**
            REFACTOR: it would be useful to implement a `SendObject` method on `Communicator`
            that would handle the serialization.
            */
            _comm.Send(msg_string);

            Task<string> task;
            try
            {
                /**
                REFACTOR: it would be useful to implement a `ReceiveWithTimeout` method on
                the `Communicator` that would contain the code below
                (it may be async so it does not block).
                 */
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
            var gamesList = AutoMapper.Mapper.Map<List<GameInfo>>(gamesDto);

            return gamesList;
        }
    }
}
