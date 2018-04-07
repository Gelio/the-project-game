using Newtonsoft.Json;
using System.IO;

namespace Player
{
    public class ConfigFileReader
    {
        public PlayerConfig ReadConfigFile(string configFilePath)
        {
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

            return configFileObject;
        }
    }
}
