using System;
using System.Collections.Generic;
using System.Text;

namespace Player.GameObjects
{
    public class Board
    {
        private readonly BoardSize _size;
        private List<Tile> _tiles;

        public int SizeX { get; private set; }
        public int SizeY { get; private set; }
        public int GoalAreaSize { get; private set; }
        public int TaskAreaSize { get; private set; }

        public int SecondGoalAreaTopY { get; private set; }

        public Board(BoardSize size)
        {
            _size = size;
            SizeX = _size.X;
            SizeY = _size.GoalArea * 2 + _size.TaskArea;
            GoalAreaSize = _size.GoalArea;
            TaskAreaSize = _size.TaskArea;
            SecondGoalAreaTopY = _size.GoalArea + _size.TaskArea;

            _tiles = new List<Tile>();
            Reset();
        }

        /// <summary>
        /// Return reference to <c>Tile</c> at position (<paramref name="x"/>, <paramref name="y"/>)
        /// </summary>
        /// <param name="x">X position</param>
        /// <param name="y">Y position</param>
        /// <returns><c>Tile</c></returns>
        public Tile At(int x, int y)
        {
            return _tiles[y * SizeX + x];
        }

        /// <summary>
        /// Return reference to <c>Tile</c> using 1-dimensional <paramref name="index"/>
        /// </summary>
        /// <param name="index">index of 1-dimensional array</param>
        /// <returns><c>Tile</c></returns>
        public Tile At(int index)
        {
            return _tiles[index];
        }

        /// <summary>
        /// Check if a given position is inside ANY of the two existing Goal Areas
        /// </summary>
        /// <param name="x">X position</param>
        /// <param name="y">Y position</param>
        /// <returns><c>true</c> if inside any goal area, <c>false</c> if inside task area</returns>
        public bool IsGoalArea(int x, int y)
        {
            return y < _size.GoalArea || y >= _size.GoalArea + _size.TaskArea;
        }

        /// <summary>
        /// Find the position of a player, given their Id
        /// </summary>
        /// <param name="playerId">Id of a player</param>
        /// <returns>If found: (x, y)-coordinates of a player,
        ///
        /// else: (-1, -1)</returns>
        public (int x, int y) FindPlayerPosition(string playerId)
        {
            int x, y;
            for (y = 0; y < SizeY; y++)
                for (x = 0; x < SizeX; x++)
                    if (At(x, y).PlayerId == playerId)
                        return (x, y);

            return (-1, -1);
        }

        /// <summary>
        /// Get players' positions
        /// </summary>
        /// <param name="excluded">Id of players excluded from result</param>
        /// <returns>List of (x, y)-coordinates of players</returns>
        public List<(int x, int y)> GetPlayersPositions(List<string> excluded)
        {
            int x, y;
            var result = new List<(int x, int y)>();
            for (y = 0; y < SizeY; y++)
                for (x = 0; x < SizeX; x++)
                    if (At(x, y).PlayerId != null && !excluded.Contains(At(x, y).PlayerId))
                        result.Add((x, y));

            return result;
        }

        /// <summary>
        /// Removes outdated playerId info
        /// </summary>
        public void RemoveCachedPlayerIds(List<string> idsToRemove, long latestTimestamp)
        {
            int x, y;
            var result = new List<(int x, int y)>();
            for (y = 0; y < SizeY; y++)
                for (x = 0; x < SizeX; x++)
                {
                    var tile = At(x, y);
                    if (tile.PlayerId != null && idsToRemove.Contains(tile.PlayerId) && tile.Timestamp < latestTimestamp)
                        tile.PlayerId = null;
                }
        }


        /// <summary>
        /// Reset board preserving size info
        /// </summary>
        public void Reset()
        {
            _tiles.Clear();
            for (int i = 0; i < SizeX * SizeY; i++)
                _tiles.Add(new Tile());
        }
    }
}
