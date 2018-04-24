using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Tests
{
    public class Consts
    {
        public static string PLAYER_ACCEPTED = @"{""type"":""PLAYER_ACCEPTED"",""senderId"":-1,""recipientId"":13587145,""payload"":{""assignedPlayerId"":5}}";
        public static string PLAYER_REJECTED = @"{""type"":""PLAYER_REJECTED"",""senderId"":-1,""recipientId"":4541568,""payload"":{""reason"":""opcjonalny tekstowy opis powodu niepowodzenia""}}";
        public static string LIST_GAMES_RESPONSE = @"{""type"":""LIST_GAMES_RESPONSE"",""senderId"":-3,""payload"":{""games"":[{""name"":""Default"",""description"":""This field is for UI purposes"",""teamSizes"":{""1"":5,""2"":5},""boardSize"":{""x"":40,""taskArea"":40,""goalArea"":2},""maxRounds"":5,""goalLimit"":15,""delays"":{""move"":4000,""pick"":1000,""discover"":2500,""destroy"":1000,""test"":3000,""communicationRequest"":4000,""communicationAccept"":4000,""tryPiece"":4000}},{""name"":""Quick"",""description"":""A quick-paced game on a small field"",""teamSizes"":{""1"":3,""2"":3},""boardSize"":{""x"":15,""taskArea"":10,""goalArea"":2},""maxRounds"":5,""goalLimit"":10,""delays"":{""move"":2000,""pick"":500,""discover"":1250,""destroy"":500,""test"":2000,""communicationRequest"":1000,""communicationAccept"":1000,""tryPiece"":1000}}]}}";
        public static string EMPTY_LIST_GAMES_RESPONSE = @"{""type"": ""LIST_GAMES_RESPONSE"", ""senderId"": -3, ""payload"": {""games"": []}}";
        public static string ACTION_VALID_RESPONSE = @"{""type"": ""ACTION_VALID"", ""senderId"": -1, ""payload"": {""delay"": 1000}}";
        public static string GAME_FINISHED_RESPONSE = @"{""type"": ""GAME_FINISHED"", ""senderId"": ""GAME_MASTER"", ""recipientId"": ""uuid"", ""payload"": { ""team1Score"": 20, ""team2Score"": 16, }}";
    }
}
