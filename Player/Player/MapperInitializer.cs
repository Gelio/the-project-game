using Player.GameObjects;
using Player.Messages.DTO;
using System.Collections.Generic;

namespace Player
{
    public static class MapperInitializer
    {
        public static bool isInitialized;

        public static void InitializeMapper()
        {
            /**
            NOTE: should the `isInitialized` flag be checked so Mapper is not initialized multiple
            times?
             */
            isInitialized = true;
            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<GameInfoDTO, GameInfo>();
                cfg.CreateMap<BoardSizeDTO, BoardSize>();
                cfg.CreateMap<DelaysDTO, Delays>();
                cfg.CreateMap<TileDiscoveryDTO, Tile>()
                    .ForMember(tile => tile.Piece, opt => opt.Ignore());
                cfg.CreateMap<PlayerPositionDTO, PlayerPosition>();
            });
        }
    }
}
