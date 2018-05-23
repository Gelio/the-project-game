using Player.Messages.Requests;
using Player.Messages.Responses;

namespace Player.Interfaces
{
    public interface IMessageProvider
    {
        Message<P> Receive<P>() where P : IPayload, new();
        bool AssertPlayerStatus(int timeout);
        void SendMessage(Message<IPayload> message);
        void SendMessageWithTimeout(Message<IPayload> message, int timeout);

    }
}
