using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Player
{
    public class Player
    {
        public int Id;
        public int TeamId;
        public bool IsLeader;
        public string GameName;

        public int AskLevel;
        public int RespondLevel;
        public int Timeout;
        public string ServerHostName => _communicator.ServerHostName;
        public int ServerPort => _communicator.ServerPort;

        private ICommunicator _communicator;

        public Player(ICommunicator communicator, IPlayerConfig config)
        {
            _communicator = communicator;

            AskLevel = config.AskLevel;
            RespondLevel = config.RespondLevel;
            Timeout = config.Timeout;
            GameName = config.GameName;
        }

        public void ConnectToServer()
        {
            _communicator.Connect();

            var playerHelloObject = new
            {
                type = "PLAYER_HELLO",
                senderId = -2,
                payload = new
                {
                    game = GameName,
                    teamId = TeamId,
                    isLeader = IsLeader,
                    temporaryId = new Random().Next(1, 10000)
                }
            };
            var playerHelloMessage = JsonConvert.SerializeObject(playerHelloObject);

            _communicator.Send(playerHelloMessage);

            var receivedMessage = _communicator.Receive();

            var definition = new
            {
                type = "",
                senderId = 0,
                receipientId = 0,
                payload = new
                {
                    assignedPlayerId = 0
                }
            };
            var deserializedObject = JsonConvert.DeserializeAnonymousType(receivedMessage, definition);

            Id = deserializedObject.payload.assignedPlayerId;
        }
    }
}