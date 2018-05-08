using System;
using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class TestPieceResponsePayload : IPayload
    {
        public bool IsSham;

        public string PayloadType()
        {
            throw new NotImplementedException();
        }
    }
}
