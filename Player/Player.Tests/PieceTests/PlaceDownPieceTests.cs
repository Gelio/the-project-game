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
using static Player.Player;

namespace Player.Tests.PieceTests
{
    [TestFixture]
    class PlaceDownPieceTests
    {
        static string _assignedPlayerId = Guid.NewGuid().ToString();
        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<ICommunicator> _communicator;
        Mock<IGameService> _gameService;

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
        }

        public static IEnumerable<TestCaseData> PlaceDownPieceSuccessTestCases
        {
            get
            {
                yield return new TestCaseData(_scoreMsg, 2, 2, true, Player.PlaceDownPieceResult.Score).SetName("Score");
                yield return new TestCaseData(_noScoreMsg, 2, 2, true, Player.PlaceDownPieceResult.NoScore).SetName("NoScore");
                yield return new TestCaseData(_shamMsg, 2, 2, true, Player.PlaceDownPieceResult.Sham).SetName("Sham");
                yield return new TestCaseData(_taskAreaMsg, 2, 21, true, Player.PlaceDownPieceResult.TaskArea).SetName("TaskArea");
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
            player.HeldPiece = new Piece();


            (var boolResult, var enumResult) = player.PlaceDownPiece();

            // ------------------------
            Assert.That(boolResult, Is.EqualTo(expectedBoolResult));
            Assert.That(enumResult, Is.EqualTo(exceptedEnumResult));
        }

        [Test]
        public void PlaceDownPieceActionInvalid()
        {
            var messageReceived = new Message<ActionInvalidPayload>
            {
                Type = Common.Consts.ActionInvalid,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new ActionInvalidPayload
                {
                    Reason = "she did not want to go DOWN to you PLACE"
                }
            };
            _communicator.Setup(x => x.Receive()).Returns(JsonConvert.SerializeObject(messageReceived));

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            (var boolResult, var enumResult) = player.PlaceDownPiece();

            Assert.That(boolResult, Is.False);
            Assert.That(enumResult, Is.EqualTo(PlaceDownPieceResult.NoScore));
        }

        [Test]
        public void PlaceDownPieceInvalidMessageType()
        {
            var messageReceived = new Message<PlaceDownPieceResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Type = Consts.EMPTY_LIST_GAMES_RESPONSE
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            Assert.Throws<InvalidTypeReceivedException>(() => player.PlaceDownPiece());
        }

        [Test]
        public void PlaceDownPieceNoPayload()
        {
            var messageReceived = new Message
            {
                Type = Common.Consts.PlaceDownPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = _assignedPlayerId,
            };

            Assert.Throws<NoPayloadException>(() => player.PlaceDownPiece());
        }
    }
}
