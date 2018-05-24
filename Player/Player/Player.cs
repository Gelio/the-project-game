using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Requests;
using Player.Messages.Responses;
using Player.Strategy;

namespace Player
{
    public class Player
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private IActionExecutor _actionExecutor;
        private IGameService _gameService;
        private IMessageProvider _messageProvider;
        private PlayerConfig _playerConfig;
        private PlayerState _playerState;


        public Player(PlayerConfig playerConfig, IGameService gameService, IMessageProvider messageProvider, PlayerState playerState, IActionExecutor actionExecutor)
        {
            _gameService = gameService;
            _messageProvider = messageProvider;
            _playerConfig = playerConfig;
            _playerState = playerState;
            _actionExecutor = actionExecutor;
        }


        public void Start()
        {
            GetGameInfo();

            while (true)
            {
                _playerState.ResetState();

                int tries = 3;
                while (true)
                {
                    try
                    {
                        ConnectToServer();
                        break;
                    }
                    catch (PlayerRejectedException)
                    {
                        tries--;
                    }
                    if (tries == 0)
                        throw new GameAlreadyFinishedException("Game over");
                }

                WaitForGameStart();
                // CAUTION: After refactor, make sure the strategy calls `RefreshBoardState` at the very beginning, to update init position & to set the GoalAreaDirection!
                try
                {
                    Play();
                }
                catch (GameAlreadyFinishedException e)
                {
                    RoundFinished(e.Message);

                    logger.Info($"Waiting {_playerConfig.Timeout}s for new round...");
                    Task.Delay(_playerConfig.Timeout).Wait();
                }
            }
        }

        public void GetGameInfo()
        {
            var gamesList = _gameService.GetGamesList();
            _playerState.Game = gamesList.FirstOrDefault(x => x.Name == _playerConfig.GameName);
            if (_playerState.Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }
            _playerState.InitBoard();
        }

        public void ConnectToServer()
        {
            _messageProvider.SendMessageWithTimeout(new Message<IPayload>
            {
                Type = Consts.PlayerHelloRequest,
                SenderId = _playerState.Id,
                Payload = new PlayerHelloPayload
                {
                    Game = _playerConfig.GameName,
                    TeamId = _playerConfig.TeamNumber,
                    IsLeader = _playerConfig.IsLeader,
                }
            }, _playerConfig.Timeout);
            _messageProvider.AssertPlayerStatus(_playerConfig.Timeout);
            logger.Info($"Player ({_playerState.Id}) connected to server");
            logger.Debug($"Team no.: {_playerConfig.TeamNumber}");
            logger.Debug($"Is leader: {_playerConfig.IsLeader}");
        }

        public void WaitForGameStart()
        {
            Message<GameStartedPayload> message;
            while (true)
            {
                try
                {
                    message = _messageProvider.Receive<GameStartedPayload>();
                    break;
                }
                catch (WrongPayloadException)
                {
                    // suppress
                }
            }

            _playerState.TeamMembersIds = message.Payload.TeamInfo[_playerConfig.TeamNumber].Players;
            _playerState.TeamMembersIds.Remove(_playerState.Id);
            _playerState.TeamMembersIds.ToList().ForEach(id => _playerState.WaitingForResponse.Add(id, false));
            _playerState.LeaderId = message.Payload.TeamInfo[_playerConfig.TeamNumber].LeaderId;
            logger.Info("The game has started!");
        }

        public void Play()
        {
            var trivialStrategy = new BlockerStrategy(_playerState, _actionExecutor);
            trivialStrategy.Play();
        }

        public void RoundFinished(string receivedMessageSerialized)
        {
            var received = JsonConvert.DeserializeObject<Message<GameFinishedPayload>>(receivedMessageSerialized);
            var winnerTeam = (received.Payload.Team1Score > received.Payload.Team2Score) ? "Team 1" : "Team 2";
            string message = $"Scores:\n\tTeam 1: {received.Payload.Team1Score}\n\tTeam 2: {received.Payload.Team2Score}\n" +
                $"Congratulations {winnerTeam}! WOOP WOOP!\n";
            logger.Info(message);
        }
    }
}
