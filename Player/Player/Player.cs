using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.Common;
using System.Linq;
using Player.Messages.Responses;
using Player.Messages.Requests;

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
        public IList<int> TeamMembersIds;
        public int LeaderId;

        public Game Game;

        private ICommunicator _communicator;
        private IGameService _gameService;

        public Player(ICommunicator communicator, PlayerConfig config, IGameService gameService)
        {
            _communicator = communicator;
            _gameService = gameService;

            TeamId = config.TeamNumber;
            IsLeader = config.IsLeader;
            AskLevel = config.AskLevel;
            RespondLevel = config.RespondLevel;
            Timeout = config.Timeout;
            GameName = config.GameName;
        }

        public void Start()
        {
            GetGameInfo();
            ConnectToServer();
            WaitForGameStart();
        }

        public void GetGameInfo()
        {
            var gamesList = _gameService.GetGamesList();
            Game = gamesList.FirstOrDefault(x => x.Name == GameName);

            if (Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }
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

            var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);
            if (receivedGenericMessage.Type == Consts.PlayerRejected)
            {
                var rejectedMessage = JsonConvert.DeserializeObject<Message<PlayerRejectedPayload>>(receivedMessageSerialized);
                throw new PlayerRejectedException(rejectedMessage.Payload.Reason);
            }

            var acceptedMessage = JsonConvert.DeserializeObject<Message<PlayerAcceptedPayload>>(receivedMessageSerialized);
            Id = acceptedMessage.Payload.AssignedPlayerId;
        }

        public void Disconnect()
        {
            _communicator.Disconnect();
            Console.WriteLine("Player disconnected.");
        }
        public bool WaitForGameStart()
        {
            string receivedMessageSerialized;
            while (true)
            {
                receivedMessageSerialized = _communicator.Receive();

                var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);

                if (receivedGenericMessage.Type == Consts.GameStarted) break;
                // if (receivedGenericMessage.Type == SOMETHING_ELSE) doSomethingElse;
            }

            var message = JsonConvert.DeserializeObject<Message<GameStartedPayload>>(receivedMessageSerialized);

            TeamMembersIds = message.Payload.TeamInfo[TeamId].Players;
            LeaderId = message.Payload.TeamInfo[TeamId].LeaderId;

            return true;
        }
    }
}
