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
        int _playerVertex;
        List<int> _allForbiddenTiles;

        public Dijkstra(PlayerState playerState)
        {
            _playerState = playerState;
            Distances = new int[_playerState.Board.Count];
            IgnoreDistance = new bool[_playerState.Board.Count];
            Previous = new int[_playerState.Board.Count];
            _playerVertex = _playerState.Y * _playerState.Board.SizeX + _playerState.Y;
            _allForbiddenTiles = new List<int>();
            if (isInUpperTeam())
            {
                for (int i = _playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize); i < _playerState.Board.Count; i++)
                    _allForbiddenTiles.Add(i);
                // _allForbiddenTiles.AddRange(Enumerable.Range(_playerState.Board.SizeX * _playerState.Board.GoalAreaSize, _playerState.Board.Count).ToList());
            }
            else
            {
                for (int i = 0; i < _playerState.Board.SizeX * _playerState.Board.GoalAreaSize; i++)
                    _allForbiddenTiles.Add(i);
                // _allForbiddenTiles.AddRange(Enumerable.Range(0, _playerState.Board.SizeX * _playerState.Board.GoalAreaSize - 1).ToList());
            }
        }

        bool isInUpperTeam()
        {
            return _playerState.GoalAreaDirection == Common.Consts.Up ? false : true;
        }

        public void DijkstraAlgorithm(List<int> forbiddenTiles)
        {
            FillVertices(forbiddenTiles);

            for (int i = 0; i < _playerState.Board.Count; i++)
            {
                Distances[i] = int.MaxValue - 1;
                Previous[i] = -1;
            }

            Distances[_playerVertex] = 0;

            while (vertices.Count > 0)
            {
                int u = VertexWithSmallestDistance();

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
            if (Distances[w] == int.MaxValue - 1)
                return new Stack<int>();
            while (w != _playerVertex)
            {
                shortestPath.Push(Previous[w]);
                w = Previous[w];
            }
            shortestPath.Pop();

            return shortestPath;
        }


        private void FillVertices(List<int> forbiddenTiles)
        {
            _allForbiddenTiles.AddRange(forbiddenTiles);
            List<int> edges = new List<int>();


            //   if (isInUpperTeam())
            //   {

            //_playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize) - 1;
            //    }
            //    else
            //    {
            //        firstTile = _playerState.Board.SizeX * _playerState.Board.GoalAreaSize;
            //        lastTile = _playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize) - 1;
            //   }


            for (int i = 0; i < _playerState.Board.Count; i++)
            {
                if (!_allForbiddenTiles.Contains(i))
                {
                    if (i - _playerState.Board.SizeX >= 0 && !_allForbiddenTiles.Contains(i - _playerState.Board.SizeX))
                        edges.Add(i - _playerState.Board.SizeX);
                    if (i + _playerState.Board.SizeX < _playerState.Board.SizeX * (_playerState.Board.TaskAreaSize + _playerState.Board.GoalAreaSize) && !_allForbiddenTiles.Contains(i + _playerState.Board.SizeX))
                        edges.Add(i + _playerState.Board.SizeX);
                    if (i % _playerState.Board.SizeX != 0 && !_allForbiddenTiles.Contains(i - 1))
                        edges.Add(i - 1);
                    if ((i + 1) % _playerState.Board.SizeX != 0 && !_allForbiddenTiles.Contains(i + 1))
                        edges.Add(i + 1);

                    vertices.Add(i, edges);

                    edges = new List<int>();
                }
            }
        }

        private int VertexWithSmallestDistance()
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
