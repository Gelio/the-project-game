using System;
using System.Collections.Generic;
using System.Text;

using Newtonsoft.Json;

using Player.Messages;
using Player.Common;

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

        public Player(ICommunicator communicator, PlayerConfig config)
        {
            _communicator = communicator;

            AskLevel = config.AskLevel;
            RespondLevel = config.RespondLevel;
            Timeout = config.Timeout;
            GameName = config.GameName;
        }

        public void ConnectToServer()
        {
            if (!_communicator.IsConnected)
            {
                _communicator.Connect();
            }

            var helloMessage = new Message<PlayerHelloPayload>
            {
                Type = Consts.PlayerHelloRequest,
                SenderId = Consts.GameMasterId,
                Payload = new PlayerHelloPayload
                {
                    Game = GameName,
                    TeamId = TeamId,
                    IsLeader = IsLeader,
                    TemporaryId = new Random().Next(1, 10000)
                }
            };
            var helloMessageSerialized = JsonConvert.SerializeObject(helloMessage);
            _communicator.Send(helloMessageSerialized);


            var receivedMessageSerialized = _communicator.Receive();
            var receivedMessage = JsonConvert.DeserializeObject<Message<PlayerHelloResponsePayload>>(receivedMessageSerialized);
            Id = receivedMessage.Payload.AssignedPlayerId;
        }
    }
}
