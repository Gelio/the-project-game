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

        public Board(BoardSize size)
        {
            _size = size;
            SizeX = _size.X;
            SizeY = _size.GoalArea * 2 + _size.TaskArea;

            _tiles = new List<Tile>();
            InitBoard();
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
        /// Reset board preserving size info
        /// </summary>
        public void Reset()
        {
            InitBoard();
        }

        private void InitBoard()
        {
            for (int i = 0; i < _size.X * (_size.GoalArea * 2 + _size.TaskArea); i++)
                _tiles.Add(new Tile());
        }
    }
}
