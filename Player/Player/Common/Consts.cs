using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Common
{
    public static class Consts
    {
        public static int GameMasterId = -1;
        public static int UnknownPlayerId = -2;
        public static int CommunicationServerId = -3;

        public static string PlayerHelloRequest = "PLAYER_HELLO";
        public static string PlayerAccepted = "PLAYER_ACCEPTED";
        public static string PlayerRejected = "PLAYER_REJECTED";
        public static string ListGamesResponse = "LIST_GAMES_RESPONSE";
        public static string ListGamesRequest = "LIST_GAMES_REQUEST";
        public static string GameStarted = "GAME_STARTED";
    }
}
