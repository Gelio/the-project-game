using System;
using System.Collections.Generic;
using NUnit.Framework;
using Moq;
using Player.Common;
using Player.Interfaces;
using Newtonsoft.Json;
using Player.Messages.Responses;
using Player.Messages.DTO;
using Player.GameObjects;
using System.Linq;

namespace Player.Tests.PieceTests
{
    [TestFixture]
    class PlaceDownPieceTests
    {

        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<ICommunicator> _communicator;
        Mock<IGameService> _gameService;
        static Message<PlaceDownPieceResponsePayload> _scoreMsg;
        static Message<PlaceDownPieceResponsePayload> _noScoreMsg;
        static Message<PlaceDownPieceResponsePayload> _shamMsg;
        static Message<PlaceDownPieceResponsePayload> _taskAreaMsg;
        int _assignedPlayerId;
        [SetUp]
        public void Setup()
        {
            _assignedPlayerId = 1235;
            _communicator = new Mock<ICommunicator>();
            _playerConfig = new PlayerConfig
            {
                AskLevel = 10,
                RespondLevel = 10,
                Timeout = 11,
                GameName = "Default",
                TeamNumber = 1
            };
            _gameService = new Mock<IGameService>();

            _game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };

            _shamMsg = new Message<PlaceDownPieceResponsePayload>()
            {
                Type = Common.Consts.PlaceDownPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new PlaceDownPieceResponsePayload()
                {
                    DidCompleteGoal = null
                }
            };
            _scoreMsg = new Message<PlaceDownPieceResponsePayload>()
            {
                Type = Common.Consts.PlaceDownPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new PlaceDownPieceResponsePayload()
                {
                    DidCompleteGoal = true
                }
            };
            _noScoreMsg = new Message<PlaceDownPieceResponsePayload>()
            {
                Type = Common.Consts.PlaceDownPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new PlaceDownPieceResponsePayload()
                {
                    DidCompleteGoal = false
                }
            };
            _taskAreaMsg = new Message<PlaceDownPieceResponsePayload>()
            {
                Type = Common.Consts.PlaceDownPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new PlaceDownPieceResponsePayload()
                {
                    DidCompleteGoal = false
                }
            };
        }

        public static IEnumerable<TestCaseData> PlaceDownPieceSuccessTestCases
        {
            get
            {
                //Setup();
                yield return new TestCaseData(_scoreMsg, 2, 2, true, Player.PlaceDownPieceResult.Score).SetName("Score");
                yield return new TestCaseData(_noScoreMsg, 2, 2, false, Player.PlaceDownPieceResult.NoScore).SetName("NoScore");
                yield return new TestCaseData(_shamMsg, 2, 2, false, Player.PlaceDownPieceResult.Sham).SetName("Sham");
                yield return new TestCaseData(_taskAreaMsg, 2, 21, false, Player.PlaceDownPieceResult.TaskArea).SetName("TaskArea");
            }
        }

        [TestCaseSource("PlaceDownPieceSuccessTestCases")]
        public void PlaceDownPieceSuccess(Message<PlaceDownPieceResponsePayload> expectedMessage, int assignedX, int assignedY, bool? expectedBoolResult, Player.PlaceDownPieceResult exceptedEnumResult)
        {
            //-------------
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(expectedMessage)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            // ------------------------

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = _assignedPlayerId,
                X = assignedX,
                Y = assignedY,
                Game = _game
            };

            for (int i = 0; i < _game.BoardSize.X * (_game.BoardSize.GoalArea * 2 + _game.BoardSize.TaskArea); i++)
            {
                player.Board.Add(new Tile());
            }
            player.Board[player.X + player.Game.BoardSize.X * player.Y].Piece = new Piece();


            (var boolResult, var enumResult) = player.PlaceDownPiece();

            // ------------------------
            Assert.That(boolResult, Is.EqualTo(expectedBoolResult));
            Assert.That(enumResult, Is.EqualTo(exceptedEnumResult));
        }

        [Test]
        public void PickUpPieceActionInvalid()
        {
            var messageReceived = new Message<ActionInvalidPayload>
            {
                Type = Common.Consts.ActionInvalid,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = 1,
                Payload = new ActionInvalidPayload
                {
                    Reason = "pick-up line too cheezy"
                }
            };
            _communicator.Setup(x => x.Receive()).Returns(JsonConvert.SerializeObject(messageReceived));

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            var result = player.PickUpPiece();

            Assert.That(result, Is.False);
        }

        [Test]
        public void PickUpPieceInvalidMessageType()
        {
            var messageReceived = new Message<PickUpPieceResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = 1,
                Type = Consts.EMPTY_LIST_GAMES_RESPONSE
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            Assert.Throws<InvalidTypeReceivedException>(() => player.PickUpPiece());
        }
    }
}
