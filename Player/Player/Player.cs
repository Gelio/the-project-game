using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.Common;
using System.Linq;
using Player.Messages.Responses;
using Player.Messages.Requests;
using Player.GameObjects;
using System.Net.Sockets;
using System.Threading.Tasks;

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
        public GameInfo Game;
        public List<Tile> Board = new List<Tile>();
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
            // RefreshBoardState(); -- gives us info about all teammates' (+ ours) initial position
            Play();
        }

        public void GetGameInfo()
        {
            var gamesList = _gameService.GetGamesList();
            Game = gamesList.FirstOrDefault(x => x.Name == GameName);
            if (Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }

            for (int i = 0; i < Game.BoardSize.X * (Game.BoardSize.GoalArea * 2 + Game.BoardSize.TaskArea); i++)
            {
                Board.Add(new Tile());
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


            Task<string> receivedMessageSerializedTask;
            try
            {
                receivedMessageSerializedTask = Task.Run(() => _communicator.Receive());
                if (!receivedMessageSerializedTask.Wait(Timeout))
                    throw new TimeoutException($"Did not receive any message after {Timeout}ms");
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
            }
            var receivedMessageSerialized = receivedMessageSerializedTask.Result;

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
        public void WaitForGameStart()
        {
            string receivedMessageSerialized;
            while (true)
            {
                receivedMessageSerialized = _communicator.Receive();

                var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);

                if (receivedGenericMessage.Type == Consts.GameStarted) break;
            }

            var message = JsonConvert.DeserializeObject<Message<GameStartedPayload>>(receivedMessageSerialized);

            TeamMembersIds = message.Payload.TeamInfo[TeamId].Players;
            LeaderId = message.Payload.TeamInfo[TeamId].LeaderId;
        }

        public void Play()
        {
            while (true)
            {
                Discover();
                System.Threading.Thread.Sleep(10000);
            }
        }

        public bool Discover()
        {
            var message = new Message<DiscoveryPayload>()
            {
                Type = Consts.DiscoveryRequest,
                RecipientId = Consts.GameMasterId,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            (bool actionResult, object data) = WaitForActionResult();
            if (!actionResult)
            {
                Console.WriteLine(data as String);
                return false;
            }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);
            if (receivedRaw.Type != Consts.DiscoveryResponse)
                throw new InvalidTypeReceivedException($"Excpected: {Consts.DiscoveryResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<DiscoveryResponsePayload>>(receivedSerialized);
            foreach (var tileDTO in received.Payload.Tiles)
            {
                var tile = Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y];
                tile = AutoMapper.Mapper.Map<Tile>(tileDTO);
                tile.Timestamp = received.Payload.Timestamp;
                if (tileDTO.Piece)
                {
                    tile.Piece = new Piece();
                }
            }
            return true;
        }


        public (bool, object) WaitForActionResult()
        {
            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.ActionValid)
            {
                var received = JsonConvert.DeserializeObject<Message<ActionValidPayload>>(receivedSerialized);
                return (true, received.Payload.Delay);

            }
            if (receivedRaw.Type == Consts.ActionInvalid)
            {
                var received = JsonConvert.DeserializeObject<Message<ActionInvalidPayload>>(receivedSerialized);
                return (false, received.Payload.Reason);
            }

            throw new InvalidTypeReceivedException($"Excpected: ACTION_VALID/INVALID Received: {receivedRaw.Type}");
        }
    }
}
