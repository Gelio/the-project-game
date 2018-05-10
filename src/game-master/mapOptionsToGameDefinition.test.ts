import { ActionDelays } from '../interfaces/ActionDelays';
import { BoardSize } from '../interfaces/BoardSize';
import { GameDefinition } from '../interfaces/GameDefinition';
import { mapOptionsToGameDefinition } from './mapOptionsToGameDefinition';

describe('[GM] mapOptionsToGameDefinition', () => {
  const boardSize: BoardSize = {
    x: 30,
    goalArea: 50,
    taskArea: 300
  };
  const actionDelays: ActionDelays = {
    communicationAccept: 4000,
    communicationRequest: 4000,
    destroy: 4000,
    discover: 4000,
    move: 4000,
    pick: 4000,
    test: 4000,
    place: 4000
  };

  it('should return correct game definition', () => {
    const gameMasterOptions: any = {
      gameName: 'test name',
      gameDescription: 'test description',
      teamSizes: {
        1: 10,
        2: 10
      },
      pointsLimit: 5,
      boardSize,
      actionDelays
    };

    const gameDefinition: GameDefinition = {
      boardSize,
      name: 'test name',
      teamSizes: {
        1: 10,
        2: 10
      },
      delays: actionDelays,
      description: 'test description',
      goalLimit: 5
    };

    expect(mapOptionsToGameDefinition(gameMasterOptions)).toEqual(gameDefinition);
  });
});
