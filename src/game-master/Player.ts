import { Point } from '../common/Point';
import { TeamId } from '../common/TeamId';
import { Piece } from './models/Piece';

export class Player {
  public isConnected: boolean;
  public teamId: TeamId;
  public isLeader: boolean;
  public isBusy = false;

  public playerId: number;
  public position: Point | null = null;
  public heldPiece: Piece | null = null;
}
