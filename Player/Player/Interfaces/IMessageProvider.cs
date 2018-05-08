using Player.Messages.Requests;
using Player.Messages.Responses;

namespace Player.Interfaces
{
    public interface IMessageProvider
    {
        bool HasPendingRequests { get; }
        bool HasPendingResponses { get; }
        Message<CommunicationPayload> GetPendingRequest();
        Message<CommunicationResponsePayload> GetPendingResponse();
        Message<P> Receive<P>() where P : IPayload, new();
        bool AssertPlayerStatus(int timeout);
        void SendMessage(Message<IPayload> message);
    }
}
