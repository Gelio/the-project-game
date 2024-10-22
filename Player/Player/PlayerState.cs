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
        public List<string> TeamMembersIds;
        public string LeaderId;

        public int X;
        public int Y;
        public Tile CurrentTile => Board.At(X, Y);
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

        public PlayerState(PlayerConfig playerConfig)
        {
            Id = Guid.NewGuid().ToString();
            _communicationRequests = new Queue<Message<CommunicationPayload>>();
            _communicationResponses = new Queue<Message<CommunicationResponsePayload>>();
            WaitingForResponse = new Dictionary<string, bool>();
            PlayerConfig = playerConfig;
        }

        public void InitBoard()
        {
            Board = new Board(Game.BoardSize);
        }

        public void PrintBoard()
        {
            int i = 0;
            for (int y = 0; y < Board.SizeY; y++)
            {
                for (int x = 0; x < Board.SizeX; x++, i++)
                {
                    // var character = Board.At(i).PlayerId == null ? " " : "p";
                    string character;
                    switch (Board.At(i).GoalStatus)
                    {
                        case GoalStatusEnum.CompletedGoal:
                            character = "F";
                            break;
                        case GoalStatusEnum.NoGoal:
                            character = "x";
                            break;
                        default:
                            character = " ";
                            break;
                    }
                    if (Board[i].PlayerId != null)
                        character = "P";
                    Console.Write($"[{character}]");
                }
                Console.WriteLine();
            }
        }
    }
}
