using System.Collections.Generic;

namespace Player.Common
{
    public class Dijkstra
    {
        Dictionary<int, List<int>> vertices = new Dictionary<int, List<int>>();
        PlayerState _playerState;


        int[] _distances;
        int[] _previous;
        int _playerVerticle;


        public Dijkstra(PlayerState playerState)
        {
            _playerState = playerState;
            _distances = new int[_playerState.Board.SizeX * _playerState.Board.SizeY];
            _previous = new int[_playerState.Board.SizeX * _playerState.Board.SizeY];
            _playerVerticle = _playerState.Y * _playerState.Board.SizeX + _playerState.Y;
        }

        bool isInUpperTeam()
        {
            if (_playerState.Y <= _playerState.Board.GoalAreaSize)
            {
                return true;
            }
            return false;
        }

        public int PlayerPosition() => _playerState.Y * _playerState.Board.SizeX + _playerState.X;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="forbiddenTiles">Blocked tiles</param>
        public Stack<int> DijkstraAlgorithm(List<int> forbiddenTiles, int targetIndex)
        {
            FillVerices(forbiddenTiles);

            for (int i = 0; i < _playerState.Board.SizeX * _playerState.Board.SizeY; i++)
            {
                _distances[i] = int.MaxValue - 1;
                _previous[i] = -1;
            }

            _distances[_playerVerticle] = 0;

            while (vertices.Count > 0)
            {
                int u = VerticleWithSmallestDistance();

                List<int> uEdges = vertices[u];
                vertices.Remove(u);

                for (int j = 0; j < uEdges.Count; j++)
                {
                    if (_distances[uEdges[j]] > _distances[u] + 1)
                    {
                        _distances[uEdges[j]] = _distances[u] + 1;
                        _previous[uEdges[j]] = u;
                    }
                }
            }

            return ShortestPath(targetIndex);

        }

        private void FillVerices(List<int> forbiddenTiles)
        {
            List<int> edges = new List<int>();

            int firstTile;
            int lastTile;

            if(isInUpperTeam())
            {
                firstTile = 0;
                lastTile = _playerState.Board.SizeX * (_playerState.Board.GoalAreaSize + _playerState.Board.TaskAreaSize);
            }
            else
            {
                firstTile = _playerState.Board.SizeX * _playerState.Board.GoalAreaSize;
                lastTile = _playerState.Board.SizeX* _playerState.Board.SizeY;
            }

           
            for (int i = firstTile; i < lastTile; i++)
            {
                if (!forbiddenTiles.Contains(i))
                {
                    if (i >= _playerState.Board.SizeX && !forbiddenTiles.Contains(i - 7))
                        edges.Add(i - 7);
                    if (i < _playerState.Board.SizeX * (_playerState.Board.SizeY - 1) && !forbiddenTiles.Contains(i + 7))
                        edges.Add(i + 7);
                    if (i % _playerState.Board.SizeX != 0 && !forbiddenTiles.Contains(i - 1))
                        edges.Add(i - 1);
                    if (i + 1 % _playerState.Board.SizeX != 0 && !forbiddenTiles.Contains(i + 1))
                        edges.Add(i + 1);

                    vertices.Add(i, edges);
                }
            }
            
        }

        private int VerticleWithSmallestDistance()
        {
            int min = int.MaxValue;
            int index = -1;
            for (int i = 0; i < vertices.Count; i++)
            {
                if (_distances[i] < min)
                {
                    min = _distances[i];
                    index = i;
                }

            }
            return index;
        }

        public Stack<int> ShortestPath(int targetX)
        {
            Stack<int> shortestPath = new Stack<int>();

            int w = targetX;
            while (w != _playerVerticle)
            {
                shortestPath.Push(_previous[w]);
                w = _previous[w];
            }
            shortestPath.Pop();

            return shortestPath;
        }
    }
}
