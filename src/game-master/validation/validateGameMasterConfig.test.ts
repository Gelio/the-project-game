import { GameMasterOptions } from '../GameMaster';

import { validateGameMasterConfig } from './validateGameMasterConfig';

function getMockGameMasterConfig(): GameMasterOptions {
  return {
    serverHostname: 'localhost',
    serverPort: 4200,
    gameName: 'the project game',
    gameDescription: 'High sham chance, many pieces',
    gamesLimit: 2,
    teamSizes: {
      1: 1,
      2: 1
    },
    pointsLimit: 1,
    boardSize: {
      x: 4,
      taskArea: 3,
      goalArea: 2
    },
    shamChance: 0.5,
    generatePiecesInterval: 1500,
    piecesLimit: 5,
    logsDirectory: 'logs',
    actionDelays: {
      move: 35,
      pick: 200,
      discover: 50,
      destroy: 300,
      test: 400,
      communicationRequest: 1000,
      communicationAccept: 1000,
      place: 200
    },
    timeout: 10000,
    registrationTriesLimit: 5,
    registerGameInterval: 10000
  };
}

describe('[GM] validateGameMasterConfig', () => {
  it('should validate config against a schema', () => {
    const config = getMockGameMasterConfig();

    config.serverPort = 50000000000;

    return expect(validateGameMasterConfig(config)).rejects.toMatchSnapshot();
  });

  it('should throw an error when pieces limit is too large', () => {
    const config = getMockGameMasterConfig();

    config.piecesLimit = 13245645;

    return expect(validateGameMasterConfig(config)).rejects.toMatchSnapshot();
  });

  it('should throw an error when team 1 size is too large', () => {
    const config = getMockGameMasterConfig();

    config.teamSizes[1] = 13245645;

    return expect(validateGameMasterConfig(config)).rejects.toMatchSnapshot();
  });

  it('should throw an error when team 2 size is too large', () => {
    const config = getMockGameMasterConfig();

    config.teamSizes[2] = 13245645;

    return expect(validateGameMasterConfig(config)).rejects.toMatchSnapshot();
  });

  it('should not throw for a valid config', async done => {
    const config = getMockGameMasterConfig();

    try {
      await validateGameMasterConfig(config);
      done();
    } catch (error) {
      done.fail('Validation failed');
    }
  });
});
