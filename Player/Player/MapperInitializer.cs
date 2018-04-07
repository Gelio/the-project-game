using Player.GameObjects;
using Player.Messages.DTO;
using System.Collections.Generic;

namespace Player
{
    public static class MapperInitializer
    {
        public static void InitializeMapper()
        {
            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<GameInfoDTO, GameInfo>();
                cfg.CreateMap<BoardSizeDTO, BoardSize>();
                cfg.CreateMap<DelaysDTO, Delays>();
            });
        }
    }
}
