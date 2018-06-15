using System;
using System.Collections.Generic;
using System.Text;
using Player.Common;
using static Player.Player;

namespace Player.Interfaces
{
    public interface IActionExecutor
    {
        bool Discover();
        bool RefreshBoardState();
        bool Move(string direction);
        bool PickUpPiece();
        (bool, PlaceDownPieceResult) PlaceDownPiece();
        bool SendCommunicationRequest(string otherId);
        bool SendCommunicationResponse(string otherId);
        bool AcceptCommunication(string otherId);
        bool RejectCommunication(string otherId);
        bool TestPiece();
        bool DeletePiece();
        bool GetActionStatus();
        void WaitForAnyResponse();
        bool IsInGoalArea(int i);
    }
}
