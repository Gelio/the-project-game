using System.Collections.Generic;
using System.Linq;

namespace Player.Common
{
    public class Dijkstra
    {
        Dictionary<int, List<int>> vertices = new Dictionary<int, List<int>>();
        PlayerState _playerState;


        public int[] Distances { get; private set; }
        bool[] IgnoreDistance;
        public int[] Previous { get; private set; }
        int _playerVerticle;


        public Dijkstra(PlayerState playerState)
        {
            _playerState = playerState;
            Distances = new int[_playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize)];
            IgnoreDistance = new bool[_playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize)];
            Previous = new int[_playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize)];
            _playerVerticle = _playerState.Y * _playerState.Board.SizeX + _playerState.Y;
        }

        bool isInUpperTeam()
        {
            return _playerState.GoalAreaDirection == Common.Consts.Up ? false : true;
        }


        public void DijkstraAlgorithm(List<int> forbiddenTiles)
        {
            FillVerices(forbiddenTiles);

            for (int i = 0; i < _playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize); i++)
            {
                Distances[i] = int.MaxValue - 1;
                Previous[i] = -1;
            }

            Distances[_playerVerticle] = 0;

            while (vertices.Count > 0)
            {
                int u = VerticleWithSmallestDistance();

                List<int> uEdges = vertices[u];
                vertices.Remove(u);
                IgnoreDistance[u] = true;
                

                for (int j = 0; j < uEdges.Count; j++)
                {
                    if (Distances[uEdges[j]] > Distances[u] + 1)
                    {
                        Distances[uEdges[j]] = Distances[u] + 1;
                        Previous[uEdges[j]] = u;
                    }
                }
            }
        }

        public Stack<int> ShortestPath(int targetIndex)
        {
            Stack<int> shortestPath = new Stack<int>();
            shortestPath.Push(targetIndex);

            int w = targetIndex;
            while (w != _playerVerticle)
            {
                shortestPath.Push(Previous[w]);
                w = Previous[w];
            }
            shortestPath.Pop();

            return shortestPath;
        }


        private void FillVerices(List<int> forbiddenTiles)
        {
            List<int> edges = new List<int>();

            int firstTile;
            int lastTile;

            if (isInUpperTeam())
            {
                firstTile = 0;
                lastTile = _playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize) - 1;
            }
            else
            {
                firstTile = _playerState.Board.SizeX * _playerState.Board.GoalAreaSize;
                lastTile = _playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize) - 1;
            }


            for (int i = firstTile; i <= lastTile; i++)
            {
                if (!forbiddenTiles.Contains(i))
                {
                    // TODO: dla drugiej druzyny na dole
                    if (i - _playerState.Board.SizeX >=0 && !forbiddenTiles.Contains(i - _playerState.Board.SizeX))
                        edges.Add(i - _playerState.Board.SizeX);
                    if (i + _playerState.Board.SizeX < _playerState.Board.SizeX * (_playerState.Board.TaskAreaSize + _playerState.Board.GoalAreaSize) && !forbiddenTiles.Contains(i + _playerState.Board.SizeX))
                        edges.Add(i + _playerState.Board.SizeX);
                    if (i % _playerState.Board.SizeX != 0 && !forbiddenTiles.Contains(i - 1))
                        edges.Add(i - 1);
                    if ((i + 1) % _playerState.Board.SizeX != 0 && !forbiddenTiles.Contains(i + 1))
                        edges.Add(i + 1);

                    vertices.Add(i, edges);

                    edges = new List<int>();
                }
            }

        }

        private int VerticleWithSmallestDistance()
        {
            int min = int.MaxValue;
            int index = -1;
            for (int i = 0; i < vertices.Count; i++)
            {
                int dictionaryKey = vertices.Keys.ToList()[i];

                if (!IgnoreDistance[dictionaryKey] && Distances[dictionaryKey] < min)
                {
                    min = Distances[dictionaryKey];
                    index = dictionaryKey;
                }

            }
            return index;
        }


    }
}
