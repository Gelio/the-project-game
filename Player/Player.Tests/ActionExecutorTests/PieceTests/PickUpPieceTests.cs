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


namespace Player.Tests.PieceTests
{
    [TestFixture]
    class PickUpPieceTests
    {
        static string _assignedPlayerId = Guid.NewGuid().ToString();
        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;
        PlayerState _playerState;

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
        }

        [Test]
        public void PickUpPieceSuccess()
        {
            var assignedX = 12;
            var assignedY = 3;
            var msg2 = new Message<PickUpPieceResponsePayload>()
            {
                Type = Common.Consts.PickupPieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId,
                Payload = new PickUpPieceResponsePayload()
            };
            _playerState.X = assignedX;
            _playerState.Y = assignedY;
            _playerState.Board = new Board(_game.BoardSize);
            _playerState.Board.At(_playerState.X, _playerState.Y).Piece = new Piece();

            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<PickUpPieceResponsePayload>()).Returns(msg2);


            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.PickUpPiece();


            Assert.That(result, Is.True);
            Assert.That(_playerState.HeldPiece, Is.Not.Null);
            Assert.That(_playerState.Board.At(_playerState.X, _playerState.Y).Piece, Is.Null);
        }

        [Test]
        public void PickUpPieceActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var actionExecutor = new ActionExecutor(_messageProvider.Object, _playerState);
            var result = actionExecutor.PickUpPiece();

            Assert.That(result, Is.False);
        }
    }
}
