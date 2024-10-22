using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using Newtonsoft.Json;
using NUnit.Framework;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Responses;
using static Player.Player;

namespace Player.Tests.PieceTests
{
    [TestFixture]
    class PlaceDownPieceTests
    {
        static string _assignedPlayerId = Guid.NewGuid().ToString();
        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;
        PlayerState _playerState;

        static Message<PlaceDownPieceResponsePayload> _scoreMsg = new Message<PlaceDownPieceResponsePayload>()
        {
            Type = Common.Consts.PlaceDownPieceResponse,
            SenderId = Common.Consts.GameMasterId,
            RecipientId = _assignedPlayerId,
            Payload = new PlaceDownPieceResponsePayload()
            {
                DidCompleteGoal = true
            }
        };
        static Message<PlaceDownPieceResponsePayload> _noScoreMsg = new Message<PlaceDownPieceResponsePayload>()
        {
            Type = Common.Consts.PlaceDownPieceResponse,
            SenderId = Common.Consts.GameMasterId,
            RecipientId = _assignedPlayerId,
            Payload = new PlaceDownPieceResponsePayload()
            {
                DidCompleteGoal = false
            }
        };
        static Message<PlaceDownPieceResponsePayload> _shamMsg = new Message<PlaceDownPieceResponsePayload>()
        {
            Type = Common.Consts.PlaceDownPieceResponse,
            SenderId = Common.Consts.GameMasterId,
            RecipientId = _assignedPlayerId,
            Payload = new PlaceDownPieceResponsePayload()
            {
                DidCompleteGoal = null
            }
        };
        static Message<PlaceDownPieceResponsePayload> _taskAreaMsg = new Message<PlaceDownPieceResponsePayload>()
        {
            Type = Common.Consts.PlaceDownPieceResponse,
            SenderId = Common.Consts.GameMasterId,
            RecipientId = _assignedPlayerId,
            Payload = new PlaceDownPieceResponsePayload()
            {
                DidCompleteGoal = null
            }
        };

        [SetUp]
        public void Setup()
        {
            _playerConfig = new PlayerConfig
            {
                AskLevel = 10,
                RespondLevel = 10,
                Timeout = 11,
                GameName = "Default",
                TeamNumber = 1
            };
            _gameService = new Mock<IGameService>();
            _messageProvider = new Mock<IMessageProvider>();
            _playerState = new PlayerState(_playerConfig);
            _game = new GameInfo()
            {
                BoardSize = new BoardSize
                {
                    GoalArea = 20,
                    TaskArea = 20,
                    X = 20
                }
            };
            _playerState.Game = _game;
            _playerState.Id = _assignedPlayerId;
            _playerState.Board = new Board(_game.BoardSize);
        }

        public static IEnumerable<TestCaseData> PlaceDownPieceSuccessTestCases
        {
            get
            {
                yield return new TestCaseData(_scoreMsg, 2, 2, true, PlaceDownPieceResult.Score).SetName("Score");
                yield return new TestCaseData(_noScoreMsg, 2, 2, true, PlaceDownPieceResult.NoScore).SetName("NoScore");
                yield return new TestCaseData(_shamMsg, 2, 2, true, PlaceDownPieceResult.Sham).SetName("Sham");
                yield return new TestCaseData(_taskAreaMsg, 2, 21, true, PlaceDownPieceResult.TaskArea).SetName("TaskArea");
            }
        }

        [TestCaseSource("PlaceDownPieceSuccessTestCases")]
        public void PlaceDownPieceSuccess(Message<PlaceDownPieceResponsePayload> expectedMessage, int assignedX, int assignedY, bool? expectedBoolResult, PlaceDownPieceResult exceptedEnumResult)
        {
            //-------------
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<PlaceDownPieceResponsePayload>()).Returns(expectedMessage);

            _playerState.X = assignedX;
            _playerState.Y = assignedY;
            _playerState.HeldPiece = new Piece();

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            (var boolResult, var enumResult) = actionExecutor.PlaceDownPiece();

            // ------------------------
            Assert.That(boolResult, Is.EqualTo(expectedBoolResult));
            Assert.That(enumResult, Is.EqualTo(exceptedEnumResult));
        }

        [Test]
        public void PlaceDownPieceActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            (var boolResult, var enumResult) = actionExecutor.PlaceDownPiece();

            Assert.That(boolResult, Is.False);
            Assert.That(enumResult, Is.EqualTo(PlaceDownPieceResult.NoScore));
        }

        [Test]
        public void PlaceDownPieceNoPayload()
        {
            var msg2 = new Message<PlaceDownPieceResponsePayload>
            {
                Type = Common.Consts.PlaceDownPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = null
            };
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<PlaceDownPieceResponsePayload>()).Returns(msg2);


            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);

            Assert.Throws<NoPayloadException>(() => actionExecutor.PlaceDownPiece());
        }
    }
}
