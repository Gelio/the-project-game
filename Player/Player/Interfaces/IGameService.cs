using Player.GameObjects;
using System;
using System.Collections.Generic;
using System.Text;

namespace Player.Interfaces
{
    public interface IGameService
    {
        IList<Game> GetGamesList();
    }
}
