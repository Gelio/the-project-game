using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Common
{
    public static class Consts
    {
        public static string GameMasterId = "GAME_MASTER";
        public static string CommunicationServerId = "COMMUNICATION_SERVER";
        public static string UnregisteredPlayerId = "UNREGISTERED_PLAYER";

        public static string PlayerHelloRequest = "PLAYER_HELLO";
        public static string PlayerAccepted = "PLAYER_ACCEPTED";
        public static string PlayerRejected = "PLAYER_REJECTED";
        public static string ListGamesResponse = "LIST_GAMES_RESPONSE";
        public static string ListGamesRequest = "LIST_GAMES_REQUEST";
        public static string GameStarted = "GAME_STARTED";
        public static string DiscoveryRequest = "DISCOVERY_REQUEST";
        public static string DiscoveryResponse = "DISCOVERY_RESPONSE";
        public static string ActionValid = "ACTION_VALID";
        public static string ActionInvalid = "ACTION_INVALID";
        public static string RefreshStateRequest = "REFRESH_STATE_REQUEST";
        public static string RefreshStateResponse = "REFRESH_STATE_RESPONSE";
        public static string MoveRequest = "MOVE_REQUEST";
        public static string MoveResponse = "MOVE_RESPONSE";
        public static string PickupPieceRequest = "PICK_UP_PIECE_REQUEST";
        public static string PickupPieceResponse = "PICK_UP_PIECE_RESPONSE";
        public static string PlaceDownPieceRequest = "PLAC_DOWN_PIECE_REQUEST";
        public static string PlaceDownPieceResponse = "PLAC_DOWN_PIECE_RESPONSE";
    }
}

