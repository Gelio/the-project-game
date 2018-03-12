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

        private ICommunicator _communicator;

        public Player(ICommunicator communicator)
        {
            _communicator = communicator;
        }

        public void Initialize()
        {
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
