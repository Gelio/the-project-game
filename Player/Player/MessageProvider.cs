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
    public class MessageProvider
    {
        private List<Message<CommunicationPayload>> _communicationRequests;
        private List<Message<CommunicationResponsePayload>> _communicationResponses;
        private ICommunicator _communicator;

        public MessageProvider(ICommunicator communicator)
        {
            _communicationRequests = new List<Message<CommunicationPayload>>();
            _communicationResponses = new List<Message<CommunicationResponsePayload>>();
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
                    return JsonConvert.DeserializeObject<Message<P>>(serializedMessage);
                if (message.Type == Consts.GameFinished)
                    throw new GameAlreadyFinishedException();
                if (message.Type == Consts.CommunicationRequest)
                {
                    _communicationRequests.Add(JsonConvert.DeserializeObject<Message<CommunicationPayload>>(serializedMessage));
                    continue;
                }
                else if (message.Type == Consts.CommunicationResponse)
                {
                    _communicationResponses.Add(JsonConvert.DeserializeObject<Message<CommunicationResponsePayload>>(serializedMessage));
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
