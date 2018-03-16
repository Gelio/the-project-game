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
            throw new NotImplementedException();

            /*
             * {
                   "type": "LIST_GAMES_REQUEST",
                   "senderId": -2
                }
            */
        }
    }
}
