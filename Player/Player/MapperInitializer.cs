using System.Collections.Generic;
using Player.GameObjects;
using Player.Messages.DTO;


namespace Player
{
    public static class MapperInitializer
    {
        public static bool isInitialized;

        public static void InitializeMapper()
        {
            isInitialized = true;
            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<GameInfoDTO, GameInfo>();
                cfg.CreateMap<BoardSizeDTO, BoardSize>();
                cfg.CreateMap<DelaysDTO, Delays>();
                cfg.CreateMap<TileDiscoveryDTO, Tile>()
                    .ForMember(tile => tile.Piece, opt => opt.Ignore());
                cfg.CreateMap<PlayerPositionDTO, PlayerPosition>();

                // TODO: check if it works
                cfg.CreateMap<TileCommunicationDTO, Tile>()
                    .ForMember(dest => dest.Piece, opt => opt.ResolveUsing(
                        src => src.Piece == null ? new Piece { HasInfo = false } : new Piece { HasInfo = true, IsSham = src.Piece.IsSham, WasTested = src.Piece.WasTested }));
                cfg.CreateMap<Tile, TileCommunicationDTO>()
                    .ForMember(dest => dest.Piece, opt => opt.ResolveUsing(
                        src => (src.Piece == null || src.Piece.HasInfo == false) ? null : new PieceDTO { IsSham = src.Piece.IsSham, WasTested = src.Piece.WasTested }));
            });
        }
    }
}
