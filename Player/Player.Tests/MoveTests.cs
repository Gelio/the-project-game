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

namespace Player.Tests
{
    [TestFixture]
    class MoveTests
    {
        PlayerConfig _playerConfig;
        GameInfo _game;

        Mock<ICommunicator> _communicator;
        Mock<IGameService> _gameService;

        string Up = "up";

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

        [Test]
        public void MoveInvalidMessageType()
        {
            var messageReceived = new Message<MoveResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = Guid.NewGuid().ToString(),
                Type = Consts.EMPTY_LIST_GAMES_RESPONSE
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Game = _game
            };

            Assert.Throws<InvalidTypeReceivedException>(() => player.Move(Up));
        }

        [Test]
        public void MoveActionInvalid()
        {
            var messageReceived = new Message<ActionInvalidPayload>
            {
                Type = Common.Consts.ActionInvalid,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = Guid.NewGuid().ToString(),
                Payload = new ActionInvalidPayload
                {
                    Reason = "You cannot move, noone in your family moves"
                }
            };
            _communicator.Setup(x => x.Receive()).Returns(JsonConvert.SerializeObject(messageReceived));

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Game = _game
            };

            var result = player.Move(Up);

            Assert.That(result, Is.False);
        }

        [TestCase("up")]
        [TestCase("down")]
        [TestCase("left")]
        [TestCase("right")]
        public void MoveSuccess(string direction)
        {
            var assignedPlayerId = Guid.NewGuid().ToString();

            var assignedX = 1;
            var assignedY = 1;
            int indexBeforeMove = assignedX + _game.BoardSize.X * assignedY;

            int newX = assignedX;
            int newY = assignedY;
            switch (direction)
            {
                case "up":
                    newY -= 1;
                    break;
                case "down":
                    newY += 1;
                    break;
                case "left":
                    newX -= 1;
                    break;
                case "right":
                    newX += 1;
                    break;
            }
            int indexAfterMove = newX + _game.BoardSize.X * newY;

            var messageReceived = new Message<MoveResponsePayload>
            {
                Type = Common.Consts.MoveResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId,
                Payload = new MoveResponsePayload
                {
                    DistanceToPiece = 5,
                    TimeStamp = 10
                }
            };

            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Id = assignedPlayerId,
                X = assignedX,
                Y = assignedY,
                Game = _game
            };
            for (int i = 0; i < _game.BoardSize.X * (_game.BoardSize.GoalArea * 2 + _game.BoardSize.TaskArea); i++)
                player.Board.Add(new Tile());
            player.Board[indexBeforeMove].PlayerId = assignedPlayerId;


            var result = player.Move(direction);

            Assert.That(result, Is.True);
            Assert.That(player.Board[indexBeforeMove].PlayerId, Is.Null);
            Assert.That(player.Board[indexAfterMove].PlayerId, Is.EqualTo(assignedPlayerId));
            Assert.That(player.Board[indexAfterMove].DistanceToClosestPiece, Is.EqualTo(messageReceived.Payload.DistanceToPiece));
            Assert.That(player.Board[indexAfterMove].Timestamp, Is.EqualTo(messageReceived.Payload.TimeStamp));
            Assert.That(player.X, Is.EqualTo(newX));
            Assert.That(player.Y, Is.EqualTo(newY));
        }

        [Test]
        public void MoveNoPayload()
        {
            var assignedPlayerId = Guid.NewGuid().ToString();
            var messageReceived = new Message
            {
                Type = Common.Consts.MoveResponse,
                SenderId = Common.Consts.GameMasterId,
                RecipientId = assignedPlayerId
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(messageReceived)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Game = _game
            };

            Assert.Throws<NoPayloadException>(() => player.Move(Up));
        }

        //[Test]
        //public void MoveWrongPayload()
        //{
        //    var assignedPlayerId = 1;
        //    var messageReceived = new Message<GameStartedPayload>
        //    {
        //        Type = Common.Consts.MoveResponse,
        //        SenderId = Common.Consts.GameMasterId,
        //        RecipientId = assignedPlayerId,
        //        Payload = new GameStartedPayload
        //        {
        //            TeamInfo = new Dictionary<int, TeamInfoDTO>()
        //            {
        //                {1, new TeamInfoDTO
        //                {
        //                    LeaderId = 2,
        //                    Players = new List<int>(){1, 2, 3, 4}
        //                }},
        //                {2, new TeamInfoDTO
        //                {
        //                    LeaderId = 5,
        //                    Players = new List<int>(){5,6,7,8}
        //                }}
        //            }

        //        }
        //    };
        //    var queue = new Queue<string>(new[]
        //    {
        //        Consts.ACTION_VALID_RESPONSE,
        //        JsonConvert.SerializeObject(messageReceived)
        //    });
        //    _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);

        //    var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
        //    {
        //        Id = assignedPlayerId,
        //        Game = _game
        //    };


        //    Assert.Throws<WrongPayloadException>(() => player.Move(Up));
        //}

        [Test]
        public void MoveWrongDirection()
        {
            var invalidDirection = "top left";

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object);

            var result = player.Move(invalidDirection);

            Assert.That(result, Is.False);
        }

        [Test]
        public void MoveGameAlreadyFinishedBeforeGettingActionStatus()
        {
            _communicator.Setup(x => x.Receive()).Returns(Consts.GAME_FINISHED_RESPONSE);

            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Game = _game
            };

            Assert.Throws<GameAlreadyFinishedException>(() => player.Move(Up));
        }

        [Test]
        public void MoveGameAlreadyFinishedAfterGettingActionStatus()
        {
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                Consts.GAME_FINISHED_RESPONSE
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);
            var player = new Player(_communicator.Object, _playerConfig, _gameService.Object)
            {
                Game = _game
            };

            Assert.Throws<GameAlreadyFinishedException>(() => player.Move(Up));
        }
    }
}
