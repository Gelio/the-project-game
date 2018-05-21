using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.Requests;
using Player.Messages.Responses;
using System;
using System.Collections.Generic;
using System.Text;

namespace Player
{
    public class PlayerState
    {
        public string Id;
        public IList<string> TeamMembersIds;
        public string LeaderId;

        public int X;
        public int Y;

        public Board Board;
        public Piece HeldPiece;
        public string GoalAreaDirection;
        public GameInfo Game;
        public PlayerConfig PlayerConfig;

        public Dictionary<string, bool> WaitingForResponse;

        private Queue<Message<CommunicationPayload>> _communicationRequests;
        private Queue<Message<CommunicationResponsePayload>> _communicationResponses;

        public bool HasPendingRequests => _communicationRequests.Count > 0;
        public bool HasPendingResponses => _communicationResponses.Count > 0;
        public Message<CommunicationPayload> GetPendingRequest() => _communicationRequests.Dequeue();
        public Message<CommunicationResponsePayload> GetPendingResponse() => _communicationResponses.Dequeue();
        public void PutRequest(Message<CommunicationPayload> request) => _communicationRequests.Enqueue(request);
        public void PutResponse(Message<CommunicationResponsePayload> response) => _communicationResponses.Enqueue(response);

        public void ResetState()
        {
            Board.Reset();
            HeldPiece = null;
            WaitingForResponse.Clear();
            _communicationRequests.Clear();
            _communicationResponses.Clear();
        }

        public PlayerState()
        {
            Id = Guid.NewGuid().ToString();
            _communicationRequests = new Queue<Message<CommunicationPayload>>();
            _communicationResponses = new Queue<Message<CommunicationResponsePayload>>();
            WaitingForResponse = new Dictionary<string, bool>();
        }

        public void InitBoard()
        {
            Board = new Board(Game.BoardSize);
        }

    }
}
