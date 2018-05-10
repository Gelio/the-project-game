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

namespace Player
{
    public class MessageProvider : IMessageProvider
    {
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        private Queue<Message<CommunicationPayload>> _communicationRequests;
        private Queue<Message<CommunicationResponsePayload>> _communicationResponses;
        private ICommunicator _communicator;

        public MessageProvider(ICommunicator communicator)
        {
            _communicationRequests = new Queue<Message<CommunicationPayload>>();
            _communicationResponses = new Queue<Message<CommunicationResponsePayload>>();
            _communicator = communicator;
        }

        public bool HasPendingRequests => _communicationRequests.Count > 0;
        public bool HasPendingResponses => _communicationResponses.Count > 0;
        public Message<CommunicationPayload> GetPendingRequest() => _communicationRequests.Dequeue();
        public Message<CommunicationResponsePayload> GetPendingResponse() => _communicationResponses.Dequeue();
        public Message<P> Receive<P>() where P : IPayload, new()
        {
            CheckConnection();

            var dummyInstance = new P();

            while (true)
            {
                var serializedMessage = _communicator.Receive();
                var message = JsonConvert.DeserializeObject<Message>(serializedMessage);


                if (dummyInstance.PayloadType() == Consts.ActionValid && message.Type == Consts.ActionInvalid)
                {
                    var reason = JsonConvert.DeserializeObject<Message<ActionInvalidPayload>>(serializedMessage).Payload.Reason;
                    throw new ActionInvalidException(reason);
                }

                if (message.Type == dummyInstance.PayloadType())
                {
                    logger.Debug($"Received expected message type ({dummyInstance.PayloadType()})");
                    return JsonConvert.DeserializeObject<Message<P>>(serializedMessage);
                }
                if (message.Type == Consts.GameFinished)
                    throw new GameAlreadyFinishedException();
                if (message.Type == Consts.CommunicationRequest)
                {
                    var request = JsonConvert.DeserializeObject<Message<CommunicationPayload>>(serializedMessage);
                    _communicationRequests.Enqueue(request);
                    logger.Info($"Received communication request from {request.Payload.SenderPlayerId}");
                    logger.Debug($"Pending requests: {_communicationRequests.Count}, Pending responses: {_communicationResponses.Count}");
                    continue;
                }
                else if (message.Type == Consts.CommunicationResponse)
                {
                    var response = JsonConvert.DeserializeObject<Message<CommunicationResponsePayload>>(serializedMessage);
                    if (response.Payload.Accepted)
                    {
                        _communicationResponses.Enqueue(response);
                        logger.Info($"Received accepted communication response from {response.Payload.SenderPlayerId}");
                    }
                    else
                    {
                        logger.Info($"Received rejected communication response from {response.Payload.SenderPlayerId}");
                    }
                    logger.Debug($"Pending requests: {_communicationRequests.Count}, Pending responses: {_communicationResponses.Count}");
                    continue;
                }
                else
                    throw new WrongPayloadException(message.Type);
            }
        }

        public bool AssertPlayerStatus(int timeout)
        {
            CheckConnection();

            Task<string> receiveTask;
            try
            {
                receiveTask = Task.Run(() => _communicator.Receive());
                if (!receiveTask.Wait(timeout))
                    throw new TimeoutException($"Did not receive any message after {timeout}ms");
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
            }
            var serializedMessage = receiveTask.Result;
            var message = JsonConvert.DeserializeObject<Message>(serializedMessage);

            if (message.Type == Consts.PlayerAccepted)
                return true;
            else
            {
                var reason = JsonConvert.DeserializeObject<Message<PlayerRejectedPayload>>(serializedMessage).Payload.Reason;
                throw new PlayerRejectedException(reason);
            }

        }

        public void SendMessage(Message<IPayload> message)
        {
            CheckConnection();
            var serializedMessage = JsonConvert.SerializeObject(message);
            _communicator.Send(serializedMessage);
        }

        private void CheckConnection()
        {
            if (!_communicator.IsConnected)
            {
                _communicator.Connect();
            }
        }
    }
}
