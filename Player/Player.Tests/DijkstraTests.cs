using System;
using System.Collections.Generic;
using System.Text;
using System.Collections.Generic;
using NUnit.Framework;
using Moq;
using Newtonsoft.Json;
using Player.Interfaces;
using Player.GameObjects;
using Player.Common;
using System.IO;

namespace Player.Tests
{
    [TestFixture]
    class DijkstraTests
    {
        PlayerState playerState;
        Dijkstra dijkstra;
        private object[] testSource;

        [SetUp]
        public void SetUp()
        {
            playerState = new PlayerState(null);

            BoardSize bs = new BoardSize
            {
                X = 6,
                GoalArea = 4,
                TaskArea = 10
            };

            playerState.Board = new Board(bs);
            playerState.X = 3;
            playerState.Y = 9;
            playerState.GoalAreaDirection = Common.Consts.Down;

            dijkstra = new Dijkstra(playerState);
        }

        public static IEnumerable<TestCaseData> PlaceDownPieceSuccessTestCases
        {
            get
            {
                yield return new TestCaseData(3, 9, 1, 4, Common.Consts.Down, new List<int>() { 33,34,35, 36,37, 38, 50 }); // in task area
             //   yield return new TestCaseData(3, 9, 1, 1, Common.Consts.Down, new List<int>() { 69, 70, 75 }); // in goal area
               // yield return new TestCaseData(2, 6, 3, 4, Common.Consts.Up, new List<int>() { 69, 70, 75 }); // in task area
                //yield return new TestCaseData(2, 6, 4, 16, Common.Consts.Up, new List<int>() { 69, 70, 75 }); // in goal area
            }
        }

        [TestCaseSource("PlaceDownPieceSuccessTestCases")]
        public void TestOutputUpperTeam(int playerX, int playerY, int targetX, int targetY, string goalDirection, List<int> obstacles)
        {
            playerState.X = playerX;
            playerState.Y = playerY;

            playerState.GoalAreaDirection = goalDirection;

            dijkstra.DijkstraAlgorithm(obstacles);

            Console.WriteLine($"Target: {targetY},{targetX}. Index: {targetX + targetY * playerState.Board.SizeX}");
            Console.WriteLine("Tablica previous:");

            Stack<int> previous = dijkstra.ShortestPath(targetX + targetY * playerState.Board.SizeX);
            while (previous.Count > 0)
            {
                Console.Write(previous.Pop());
                Console.Write(" ");
            }

        }
    }
}
