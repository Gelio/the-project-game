using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
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
            throw new NotImplementedException("lol3");
        }


        public JObject ReadConfigFile()
        {
            throw new NotImplementedException("lol2");
        }

    }
}
