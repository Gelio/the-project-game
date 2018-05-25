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

        [TestCase(3,4)]
        public void TestOutput(int targetX, int targetY)
        {
            List<int> obstacles = new List<int>()
            {
                33, 37, 50
            };
            dijkstra.DijkstraAlgorithm(obstacles);

            Console.WriteLine($"Target: {targetY},{targetX}. Index: {targetX + targetY * playerState.Board.SizeX}");
            Console.WriteLine("Tablica previous:");

            Stack<int> previous = dijkstra.ShortestPath(targetX + targetY * playerState.Board.SizeX);
            while(previous.Count > 0)
            {
                Console.Write(previous.Pop());
                Console.Write(" ");
            }

        }
    }
}
