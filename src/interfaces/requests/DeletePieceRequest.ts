import { PlayerRequest } from '../PlayerRequest';

export interface DeletePieceRequest extends PlayerRequest<undefined> {
  type: 'DELETE_PIECE_REQUEST';
}
