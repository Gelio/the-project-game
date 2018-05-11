using System;
using Player.Interfaces;

namespace Player.Messages.Requests
{
    public class TestPiecePayload : IPayload
    {
        public string PayloadType()
        {
            return Common.Consts.TestPieceRequest;
        }
    }
}
