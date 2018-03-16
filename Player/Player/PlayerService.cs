using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Player
{
    public class PlayerService
    {
        private string _configFilePath;

        public PlayerService(string configFilePath)
        {
            _configFilePath = configFilePath;
        }


        public Player GetPlayer()
        {
            var config = ReadConfigFile();

            var communicator = new Communicator(config.ServerHostname, config.ServerPort);

            var player = new Player(communicator, config);

            return player;
        }


        public PlayerConfig ReadConfigFile()
        {
            PlayerConfig configFileObject;
            using (StreamReader file = File.OpenText(_configFilePath))
            {
                JsonSerializer serializer = new JsonSerializer();
                configFileObject = (PlayerConfig)serializer.Deserialize(file, typeof(PlayerConfig));
            };

            return configFileObject;
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
