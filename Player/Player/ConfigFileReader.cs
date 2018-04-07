using Newtonsoft.Json;
using System.IO;

namespace Player
{
    public class ConfigFileReader
    {
        private string _defaultConfigFilePath = "player.config.json";

        public PlayerConfig ReadConfigFile(string configFilePath)
        {
            if (string.IsNullOrEmpty(configFilePath))
            {
                configFilePath = _defaultConfigFilePath;
            }

            if (!File.Exists(configFilePath))
            {
                throw new FileNotFoundException();
            }

            PlayerConfig configFileObject;
            using (StreamReader file = File.OpenText(configFilePath))
            {
                JsonSerializer serializer = new JsonSerializer();
                configFileObject = (PlayerConfig)serializer.Deserialize(file, typeof(PlayerConfig));
            };

            if(configFileObject == null)
            {
                throw new InvalidDataException();
            }

            return configFileObject;
        }
    }
}
