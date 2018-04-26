using System;
using System.Collections.Generic;
using System.Text;

namespace Player.GameObjects
{
    public class Delays
    {
        public int Move;
        public int Pick;
        public int Discover;
        public int Destroy;
        public int Test;
        public int CommunicationRequest;
        public int CommunicationAccept;
        // FIXME: `TryPiece` is no longer used (there is no action for trying a piece)
        public int TryPiece;
    }
}
