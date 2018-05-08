using System.Collections.Generic;
using Moq;
using Newtonsoft.Json;
using NUnit;
using NUnit.Framework;
using Player.Common;
using Player.Interfaces;
using Player.Messages.Requests;
using Player.Messages.Responses;

namespace Player.Tests
{
    /*
        This fixture provides tests for MessageProvider.

        The main workflow is to setup string messages returned from Communicator's Receive method, which is later called from a MessageProvider's
        generic Receive<> method, using the appropriate type (expected in a given scenario).
        To avoid writing raw blocks of text, strongly typed classes are serialized into strings (using Newtonsoft.Json lib).
        However, one should not be deceived into thinking that MessageProvider's logic relies on the C# *types* of prepared messages' payloads
        seen in the code, as the type information is lost during serialization!

        The only way MessageProvider checks the incoming message's type is by looking at the string value of a deserialized message's "Type" field.

        The purpose of this comment is to emphasize that creating successful/failing test scenarios should be prepared with caution,
        because the MessageProvider's logic relies on not-so-verbose string fields rather than on numerous, IDE-colourised class types.
    */
    [TestFixture]
    class MessageProviderTests
    {
        Mock<ICommunicator> _communicator = new Mock<ICommunicator>();
        string _id = System.Guid.NewGuid().ToString();

        [Test]
        public void SuccessfullyFinishedAction()
        {
            var msg = new Message<MoveResponsePayload> // this type is not important for the MessageProvider
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.MoveResponse,  // <--- this is *crucial* for the MessageProvider
                Payload = new MoveResponsePayload   // this type is not important for the MessageProvider
                {
                    DistanceToPiece = 1,
                    TimeStamp = 1234
                }
            };
            var queue = new Queue<string>(new[]
            {
                Consts.ACTION_VALID_RESPONSE,
                JsonConvert.SerializeObject(msg)
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);
            var result1 = system.Receive<ActionValidPayload>();
            var result2 = system.Receive<MoveResponsePayload>();


            Assert.That(result1, Is.Not.Null);
            Assert.That(result2, Is.Not.Null);
            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));
            Assert.That(result2.Type, Is.EqualTo(Common.Consts.MoveResponse));
        }

        [Test]
        public void ThrowsActionInvalidException()
        {
            var msg = new Message<ActionInvalidPayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.ActionInvalid,
                Payload = new ActionInvalidPayload
                {
                    Reason = "asdf"
                }
            };
            var serializedMsg = JsonConvert.SerializeObject(msg);
            _communicator.Setup(x => x.Receive()).Returns(serializedMsg);


            var system = new MessageProvider(_communicator.Object);


            Assert.Throws<ActionInvalidException>(() => system.Receive<ActionValidPayload>());
        }

        [Test]
        public void ThrowsWrongTypeException()
        {
            var msg = JsonConvert.SerializeObject(new Message<MoveResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.MoveResponse,
                Payload = new MoveResponsePayload
                {
                    DistanceToPiece = 1,
                    TimeStamp = 1234
                }
            });
            _communicator.Setup(x => x.Receive()).Returns(msg);

            var system = new MessageProvider(_communicator.Object);

            Assert.Throws<WrongPayloadException>(() => system.Receive<ActionValidPayload>());
            Assert.Throws<WrongPayloadException>(() => system.Receive<ActionInvalidPayload>());
            Assert.Throws<WrongPayloadException>(() => system.Receive<DiscoveryResponsePayload>());
        }

        [Test]
        public void GetsOneRequestBeforeActionValidResponse()
        {
            var msg1 = JsonConvert.SerializeObject(new Message<CommunicationPayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.CommunicationRequest,
                Payload = new CommunicationPayload
                {
                    SenderPlayerId = System.Guid.NewGuid().ToString()
                }
            });
            var msg2 = Consts.ACTION_VALID_RESPONSE;
            var msg3 = JsonConvert.SerializeObject(new Message<MoveResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.MoveResponse,
                Payload = new MoveResponsePayload
                {
                    DistanceToPiece = 1,
                    TimeStamp = 1234
                }
            });
            var queue = new Queue<string>(new[]
            {
                msg1, msg2, msg3
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);

            Assert.That(system.HasPendingRequests, Is.EqualTo(false));

            var result1 = system.Receive<ActionValidPayload>();
            var result2 = system.Receive<MoveResponsePayload>();

            Assert.That(result1, Is.Not.Null);
            Assert.That(result2, Is.Not.Null);
            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));
            Assert.That(result2.Type, Is.EqualTo(Common.Consts.MoveResponse));
            Assert.That(system.HasPendingRequests, Is.EqualTo(true));
        }

        [Test]
        public void GetsOneRequestAfterActionValidResponse()
        {
            var msg1 = Consts.ACTION_VALID_RESPONSE;
            var msg2 = JsonConvert.SerializeObject(new Message<CommunicationPayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.CommunicationRequest,
                Payload = new CommunicationPayload
                {
                    SenderPlayerId = System.Guid.NewGuid().ToString()
                }
            });
            var msg3 = JsonConvert.SerializeObject(new Message<MoveResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.MoveResponse,
                Payload = new MoveResponsePayload
                {
                    DistanceToPiece = 1,
                    TimeStamp = 1234
                }
            });
            var queue = new Queue<string>(new[]
            {
                msg1, msg2, msg3
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);

            Assert.That(system.HasPendingRequests, Is.EqualTo(false));

            var result1 = system.Receive<ActionValidPayload>();
            var result2 = system.Receive<MoveResponsePayload>();

            Assert.That(result1, Is.Not.Null);
            Assert.That(result2, Is.Not.Null);
            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));
            Assert.That(result2.Type, Is.EqualTo(Common.Consts.MoveResponse));
            Assert.That(system.HasPendingRequests, Is.EqualTo(true));
        }

        [Test]
        public void GetsOneAcceptedResponseAfterActionValidResponse()
        {
            var msg1 = Consts.ACTION_VALID_RESPONSE;
            var msg2 = JsonConvert.SerializeObject(new Message<CommunicationResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.CommunicationResponse,
                Payload = new CommunicationResponsePayload
                {
                    Accepted = true,
                    TargetPlayerId = _id,
                    Board = new List<Messages.DTO.TileCommunicationDTO>
                    {
                        new Messages.DTO.TileCommunicationDTO { DistanceToPiece = 10, TimeStamp = 1234 }
                    }
                }
            });
            var msg3 = JsonConvert.SerializeObject(new Message<DiscoveryResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.DiscoveryResponse,
                Payload = new DiscoveryResponsePayload
                {
                    Timestamp = 4321,
                    Tiles = new List<Messages.DTO.TileDiscoveryDTO>
                    {
                         new Messages.DTO.TileDiscoveryDTO { DistanceToClosestPiece = 13, X = 10, Y = 10 }
                    }
                }
            });
            var queue = new Queue<string>(new[]
            {
                msg1, msg2, msg3
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);

            Assert.That(system.HasPendingResponses, Is.EqualTo(false));

            var result1 = system.Receive<ActionValidPayload>();
            var result2 = system.Receive<DiscoveryResponsePayload>();

            Assert.That(result1, Is.Not.Null);
            Assert.That(result2, Is.Not.Null);
            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));
            Assert.That(result2.Type, Is.EqualTo(Common.Consts.DiscoveryResponse));
            Assert.That(system.HasPendingResponses, Is.EqualTo(true));
        }

        [Test]
        public void GetsOneRejectedResponseAfterActionValidResponse()
        {
            var msg1 = Consts.ACTION_VALID_RESPONSE;
            var msg2 = JsonConvert.SerializeObject(new Message<CommunicationResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.CommunicationResponse,
                Payload = new CommunicationResponsePayload
                {
                    Accepted = false,
                    TargetPlayerId = _id
                }
            });
            var msg3 = JsonConvert.SerializeObject(new Message<DiscoveryResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.DiscoveryResponse,
                Payload = new DiscoveryResponsePayload
                {
                    Timestamp = 4321,
                    Tiles = new List<Messages.DTO.TileDiscoveryDTO>
                    {
                         new Messages.DTO.TileDiscoveryDTO { DistanceToClosestPiece = 13, X = 10, Y = 10 }
                    }
                }
            });
            var queue = new Queue<string>(new[]
            {
                msg1, msg2, msg3
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);

            Assert.That(system.HasPendingResponses, Is.EqualTo(false));

            var result1 = system.Receive<ActionValidPayload>();
            var result2 = system.Receive<DiscoveryResponsePayload>();

            Assert.That(result1, Is.Not.Null);
            Assert.That(result2, Is.Not.Null);
            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));
            Assert.That(result2.Type, Is.EqualTo(Common.Consts.DiscoveryResponse));
            Assert.That(system.HasPendingResponses, Is.EqualTo(false));
        }

        [Test]
        public void ThrowsGameFinishedExceptionBeforeActionValid()
        {
            var msg = JsonConvert.SerializeObject(new Message<GameFinishedPayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.GameFinished,
                Payload = new GameFinishedPayload
                {
                    Team1Score = 10,
                    Team2Score = 0
                }
            });
            _communicator.Setup(x => x.Receive()).Returns(msg);

            var system = new MessageProvider(_communicator.Object);
            Assert.Throws<GameAlreadyFinishedException>(() => system.Receive<ActionValidPayload>());
        }


        [Test]
        public void ThrowsGameFinishedExceptionAfterActionValid()
        {
            var msg1 = Consts.ACTION_VALID_RESPONSE;
            var msg2 = JsonConvert.SerializeObject(new Message<GameFinishedPayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.GameFinished,
                Payload = new GameFinishedPayload
                {
                    Team1Score = 10,
                    Team2Score = 0
                }
            });
            var queue = new Queue<string>(new[]
            {
                msg1, msg2
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);
            var result1 = system.Receive<ActionValidPayload>();

            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));

            Assert.Throws<GameAlreadyFinishedException>(() => system.Receive<RefreshStateResponsePayload>());
        }


        [Test]
        public void GetsActionValidAndOneRequestAndWrongTypeException()
        {
            var msg1 = Consts.ACTION_VALID_RESPONSE;
            var msg2 = JsonConvert.SerializeObject(new Message<CommunicationPayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.CommunicationRequest,
                Payload = new CommunicationPayload
                {
                    SenderPlayerId = System.Guid.NewGuid().ToString()
                }
            });
            var msg3 = JsonConvert.SerializeObject(new Message<MoveResponsePayload>
            {
                SenderId = Common.Consts.GameMasterId,
                RecipientId = _id,
                Type = Common.Consts.MoveResponse,
                Payload = new MoveResponsePayload
                {
                    DistanceToPiece = 1,
                    TimeStamp = 1234
                }
            });
            var queue = new Queue<string>(new[]
            {
                msg1, msg2, msg3
            });
            _communicator.Setup(x => x.Receive()).Returns(queue.Dequeue);


            var system = new MessageProvider(_communicator.Object);
            Assert.That(system.HasPendingRequests, Is.EqualTo(false));

            var result1 = system.Receive<ActionValidPayload>();

            Assert.That(result1, Is.Not.Null);
            Assert.That(result1.Type, Is.EqualTo(Common.Consts.ActionValid));
            Assert.That(system.HasPendingRequests, Is.EqualTo(false));

            Assert.Throws<WrongPayloadException>(() => system.Receive<DiscoveryPayload>());
            Assert.That(system.HasPendingRequests, Is.EqualTo(true));
        }
    }
}
