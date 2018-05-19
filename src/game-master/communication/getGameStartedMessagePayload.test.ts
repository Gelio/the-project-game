import { Player } from '../Player';
import { PlayersContainer } from '../PlayersContainer';

import { getGameStartedMessagePayload } from './getGameStartedMessagePayload';

describe('getGameStartedMessagePayload', () => {
  let playersContainer: PlayersContainer;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    playersContainer = new PlayersContainer();

    player1 = new Player();
    player1.playerId = 'p1';
    player1.teamId = 1;
    player1.isLeader = true;

    player2 = new Player();
    player2.playerId = 'p2';
    player2.teamId = 2;
    player2.isLeader = true;
  });

  it('should should throw an error when there is no leader from team 1', () => {
    playersContainer.addPlayer(player2);

    expect(() => getGameStartedMessagePayload(playersContainer)).toThrowErrorMatchingSnapshot();
  });

  it('should should throw an error when there is no leader from team 2', () => {
    playersContainer.addPlayer(player1);

    expect(() => getGameStartedMessagePayload(playersContainer)).toThrowErrorMatchingSnapshot();
  });

  it('should generate a message matching snapshot', () => {
    playersContainer.addPlayer(player1);
    playersContainer.addPlayer(player2);

    const payload = getGameStartedMessagePayload(playersContainer);

    expect(payload).toMatchSnapshot();
  });
});
