using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Player
{
    public class PlayerFactory
    {
        private string _configFilePath;

        public PlayerFactory(string configFilePath)
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

    }
}
