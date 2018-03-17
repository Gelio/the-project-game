using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Tests
{
    public static class Consts
    {
        public static string PLAYER_ACCEPTED = @"
{
""type"": ""PLAYER_ACCEPTED"",
""senderId"": -1,
""recipientId"": 45645641568,
""payload"": {
            ""assignedPlayerId"": 5
}}";
        public static string LIST_GAMES_RESPONSE = @"{
""type"": ""LIST_GAMES_RESPONSE"",
""senderId"": -3,
""payload"": {
 ""games"": [
{
""name"": ""Default"",
""description"": ""This field is for UI purposes"",
""teamSizes"": {
""1"": 5,
""2"": 5
},
""boardSize"": {
""x"": 40,
""taskArea"": 40,
""goalArea"": 2
},
""maxRounds"": 5,
""goalLimit"": 15,
""delays"": {
""move"": 4000,
""pick"": 1000,
""discover"": 2500,
""destroy"": 1000,
""test"": 3000,
""communicationRequest"": 4000,
""communicationAccept"": 4000,
""tryPiece"": 4000
}
},
{
""name"": ""Quick"",
""description"": ""A quick-paced game on a small field"",
""teamSizes"": {
""1"": 3,
""2"": 3
},
""boardSize"": {
""x"": 15,
""taskArea"": 10,
""goalArea"": 2
},
""maxRounds"": 5,
""goalLimit"": 10,
""delays"": {
""move"": 2000,
""pick"": 500,
""discover"": 1250,
""destroy"": 500,
""test"": 2000,
""communicationRequest"": 1000,
""communicationAccept"": 1000,
""tryPiece"": 1000
}
}
]
}
}";
    }
}
