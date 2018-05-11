using System;
using Player.Interfaces;

namespace Player.Messages.Responses
{
    public class DeletePieceResponsePayload : IPayload
    {

        public string PayloadType()
        {
            return Common.Consts.DeletePieceResponse;
        }
    }
}
