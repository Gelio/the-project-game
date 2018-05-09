using System;
using Moq;
using NUnit.Framework;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.Responses;


namespace Player.Tests.PieceTests
{
    [TestFixture]
    class DeletePieceTests
    {
        static string _assignedPlayerId = Guid.NewGuid().ToString();
        PlayerConfig _playerConfig;
        GameInfo _game;
        Mock<ICommunicator> _communicator;
        Mock<IGameService> _gameService;
        Mock<IMessageProvider> _messageProvider;

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
            _messageProvider = new Mock<IMessageProvider>();
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

        [Test]
        public void DeletePieceSuccess(bool isSham)
        {
            var msg2 = new Message<DeletePieceResponsePayload>()
            {
                Type = Common.Consts.DeletePieceResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _assignedPlayerId               
            };

            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Returns(new Message<ActionValidPayload>());
            _messageProvider.Setup(x => x.Receive<DeletePieceResponsePayload>()).Returns(msg2);

            // ------------------------

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object)
            {
                Id = _assignedPlayerId,
                Game = _game
            };

            var piece = new Piece()
            {
                IsSham = false
            };

            player.HeldPiece = piece;

            var result = player.DeletePiece();

            // ------------------------

            Assert.That(result, Is.True);
            Assert.That(player.HeldPiece, Is.Null);
        }

        [Test]
        public void DeletePieceActionInvalid()
        {
            _messageProvider.Setup(x => x.Receive<ActionValidPayload>()).Throws(new ActionInvalidException());

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object, _messageProvider.Object);
            var result = player.DeletePiece();

            Assert.That(result, Is.False);
        }
    }
}
