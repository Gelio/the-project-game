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

        public PlayerState PlayerState;
        private ICommunicator _communicator;

        public MessageProvider(PlayerState playerState, ICommunicator communicator)
        {
            PlayerState = playerState;
            _communicator = communicator;
        }
        
       
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
                {
                    throw new GameAlreadyFinishedException(serializedMessage);
                }
                if (message.Type == Consts.CommunicationRequest)
                {
                    var request = JsonConvert.DeserializeObject<Message<CommunicationPayload>>(serializedMessage);
                    PlayerState.PutRequest(request);
                    logger.Info($"Received communication request from {request.Payload.SenderPlayerId}");
                    logger.Debug($"Pending requests: {PlayerState.HasPendingRequests}, Pending responses: {PlayerState.HasPendingResponses}");
                    continue;
                }
                else if (message.Type == Consts.CommunicationResponse)
                {
                    var response = JsonConvert.DeserializeObject<Message<CommunicationResponsePayload>>(serializedMessage);
                    if (response.Payload.Accepted)
                    {
                        PlayerState.PutResponse(response);
                        logger.Info($"Received accepted communication response from {response.Payload.SenderPlayerId}");
                    }
                    else
                    {
                        logger.Info($"Received rejected communication response from {response.Payload.SenderPlayerId}");
                    }
                    logger.Debug($"Pending requests: {PlayerState.HasPendingRequests}, Pending responses: {PlayerState.HasPendingResponses}");
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


        public void SendMessageWithTimeout(Message<IPayload> message, int timeout)
        {
            CheckConnection();
            var serializedMessage = JsonConvert.SerializeObject(message);

            Task sendTask;
            try
            {
                sendTask = Task.Run(() => _communicator.Send(serializedMessage));
                if (!sendTask.Wait(timeout))
                    throw new TimeoutException($"Did not send after {timeout}ms");
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
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
