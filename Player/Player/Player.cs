using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Player.Common;
using Player.GameObjects;
using Player.Interfaces;
using Player.Messages.DTO;
using Player.Messages.Requests;
using Player.Messages.Responses;

namespace Player
{
    public class Player
    {
        /**
        **General notes about this file**

        REFACTOR: this class should definitely be split into multiple smaller ones

        Some of the methods are public just so they may be used directly in the tests.
        This alone is a _code smell_. Those methods should be extracted into smaller classes
        that do that one thing.

        Those smaller classes would have those methods as `public`, which would make them
        testable without breaking any OOP principles. Additionally, they would be more
        composable and this file would be much shorter.

        I will mark candidates for extraction in the code.

        The same goes for properties - most of them are public, which goes against data
        encapsulation.
         */

        /**
        NOTE: it would be nice to use dependency injection instead of a global logger

        Especially for testing purposes
         */
        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();

        public string Id;
        public int TeamId;
        public bool IsLeader;
        public string GameName;
        public int AskLevel;
        public int RespondLevel;
        public int Timeout;
        // NOTE: would it not be easier to group X and Y into a single `Position` property?
        public int X;
        public int Y;
        // FIXME: unused variable
        public string ServerHostName => _communicator.ServerHostName;
        // FIXME: unused variable
        public int ServerPort => _communicator.ServerPort;
        public IList<string> TeamMembersIds;
        public string LeaderId;
        public GameInfo Game;
        public List<Tile> Board = new List<Tile>();
        public Piece HeldPiece;
        private ICommunicator _communicator;
        private IGameService _gameService;
        public string GoalAreaDirection;
        public bool IsConnected => _communicator.IsConnected;

        public Player(ICommunicator communicator, PlayerConfig config, IGameService gameService)
        {
            _communicator = communicator;
            _gameService = gameService;

            Id = Guid.NewGuid().ToString();
            TeamId = config.TeamNumber;
            /**
            NOTE: do we need to extract all those variables from the config?

            Using the config directly would reduce the amount of properties in the Player class.
             */
            IsLeader = config.IsLeader;
            AskLevel = config.AskLevel;
            RespondLevel = config.RespondLevel;
            Timeout = config.Timeout;
            GameName = config.GameName;
        }

        public void Start()
        {
            GetGameInfo();
            ConnectToServer();
            WaitForGameStart();
            RefreshBoardState(); // -- gives us info about all teammates' (+ ours) initial position
            logger.Debug($"Player's init position: {X} {Y}");
            GoalAreaDirection = Y < Game.BoardSize.GoalArea ? Consts.Up : Consts.Down;
            Play();
        }

        public void GetGameInfo()
        {
            /**
            REFACTOR: candidate for extraction

            Instead of modifying the `Board` property, it may return a new `Board`.
            This way you make it more testable because it does not modify anything, only returns
            new instances.
             */
            var gamesList = _gameService.GetGamesList();
            Game = gamesList.FirstOrDefault(x => x.Name == GameName);
            if (Game == null)
            {
                throw new OperationCanceledException("Game not found");
            }

            // REFACTOR: extract board size into a variable so the for loop is more readable
            for (int i = 0; i < Game.BoardSize.X * (Game.BoardSize.GoalArea * 2 + Game.BoardSize.TaskArea); i++)
            {
                Board.Add(new Tile()
                {
                    DistanceToClosestPiece = int.MaxValue,
                    GoalStatus = GoalStatusEnum.NoInfo
                });
            }
        }

        /**
        NOTE: would it not be better to use async/await and make this code run concurrently?

        I believe it would be a better practice than blocking synchronous calls.
         */
        public void ConnectToServer()
        {
            if (!_communicator.IsConnected)
            {
                _communicator.Connect();
            }

            var helloMessage = new Message<PlayerHelloPayload>
            {
                Type = Consts.PlayerHelloRequest,
                SenderId = Id,
                Payload = new PlayerHelloPayload
                {
                    Game = GameName,
                    TeamId = TeamId,
                    IsLeader = IsLeader,
                }
            };
            var helloMessageSerialized = JsonConvert.SerializeObject(helloMessage);
            // NOTE: as mentioned elsewhere, `SendObject` that serializes objects would be shorter
            // and more readable
            _communicator.Send(helloMessageSerialized);


            Task<string> receivedMessageSerializedTask;
            try
            {
                /**
                NOTE: as mentioned elsewhere, `ReceiveWithTimeout` would be shorter and more
                readable.
                 */
                receivedMessageSerializedTask = Task.Run(() => _communicator.Receive());
                if (!receivedMessageSerializedTask.Wait(Timeout))
                    throw new TimeoutException($"Did not receive any message after {Timeout}ms");
            }
            catch (AggregateException e)
            {
                throw e.InnerException;
            }
            var receivedMessageSerialized = receivedMessageSerializedTask.Result;

            var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);
            if (receivedGenericMessage.Type == Consts.PlayerRejected)
            {
                var rejectedMessage = JsonConvert.DeserializeObject<Message<PlayerRejectedPayload>>(receivedMessageSerialized);
                throw new PlayerRejectedException(rejectedMessage.Payload.Reason);
            }

            var acceptedMessage = JsonConvert.DeserializeObject<Message<PlayerAcceptedPayload>>(receivedMessageSerialized);
            logger.Info("Player connected to server");
        }

        public void Disconnect()
        {
            _communicator.Disconnect();
            logger.Info("Player disconnected.");
        }
        public void WaitForGameStart()
        {
            string receivedMessageSerialized;
            while (true)
            {
                receivedMessageSerialized = _communicator.Receive();

                var receivedGenericMessage = JsonConvert.DeserializeObject<Message>(receivedMessageSerialized);

                if (receivedGenericMessage.Type == Consts.GameStarted) break;
            }

            var message = JsonConvert.DeserializeObject<Message<GameStartedPayload>>(receivedMessageSerialized);

            TeamMembersIds = message.Payload.TeamInfo[TeamId].Players;
            LeaderId = message.Payload.TeamInfo[TeamId].LeaderId;
            logger.Info("The game has started!");
        }

        public void Play()
        {
            while (true)
            {
                /**
                NOTE: The Strategy pattern would be a perfect fit here.

                It could be implemented like so:
                1. There would be a class whose methods correspond to player actions and their return
                values would be there results of those actions. Let's call that class
                `PlayerActionPerformer` (feel free to rename it in your implementation)

                2. `IPlayerStrategy` would have a method called `PerformAction` (probably async).

                3. A concrete strategy would be a class that implements `IPlayerStrategy` and also
                takes `PlayerActionPerformer` as a dependency. It would also have access to more
                of player's properties, such as position, board, teamMemberIds etc.

                4. Player's `Play` method would call `PerformAction` on the strategy until the game
                is finished.

                Let me know what do you think about such a solution.
                */
                RefreshBoardState();
                logger.Debug("Player's position: {} {}", X, Y);
                if (HeldPiece != null)
                {
                    if (IsInGoalArea() && Board[GetCurrentBoardIndex()].GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        logger.Info("Trying to place down piece");
                        // FIXME: unnecessary variables
                        (var result, var resultEnum) = PlaceDownPiece();
                    }
                    else
                        Move(PickSweepingGoalAreaDirection());
                }
                else if (Board[GetCurrentBoardIndex()].DistanceToClosestPiece == 0) // We stand on a piece
                {
                    logger.Info("Trying to pick up piece...");
                    PickUpPiece();
                    // FIXME: unnecessary `continue`
                    continue;
                }
                else // Find a piece
                {
                    Discover();
                    string direction = PickClosestPieceDirection();
                    Move(direction);
                }
            }
        }

        private string PickClosestPieceDirection()
        {
            int bestDistance = int.MaxValue;
            int bestDx = 0, bestDy = 0;
            for (int dy = -1; dy <= 1; dy++)
                for (int dx = -1; dx <= 1; dx++)
                {
                    // TODO: check if there is a player on that field and `continue` if so
                    if (X + dx < 0 || X + dx >= Game.BoardSize.X || Y + dy < 0 || Y + dy >= (Game.BoardSize.TaskArea + Game.BoardSize.GoalArea * 2))
                        continue;
                    int index = X + dx + Game.BoardSize.X * (Y + dy);
                    logger.Debug("dx: {}, dy: {}, index: {}", dx, dy, index);
                    if (Board[index].DistanceToClosestPiece < bestDistance)
                    {
                        bestDistance = Board[index].DistanceToClosestPiece;
                        bestDx = dx;
                        bestDy = dy;
                    }
                }
            if (bestDy == -1)
                return Consts.Up;
            if (bestDy == 1)
                return Consts.Down;
            if (bestDx == -1)
                return Consts.Left;
            if (bestDx == 1)
                return Consts.Right;
            return Consts.Up;
        }
        private string PickRandomMovementDirection()
        {
            string[] directions = { Consts.Up, Consts.Down, Consts.Left, Consts.Right };
            return directions[new Random().Next(0, 4)];
        }

        private string PickSweepingGoalAreaDirection()
        {
            int startX, startY, endX, endY, dy;
            startX = 0;
            endX = Game.BoardSize.X - 1;
            if (GoalAreaDirection == Consts.Up)
            {
                startY = Game.BoardSize.GoalArea - 1;
                endY = -1;
                dy = -1;
            }
            else
            {
                startY = Game.BoardSize.GoalArea + Game.BoardSize.TaskArea;
                endY = (Game.BoardSize.GoalArea * 2) + Game.BoardSize.TaskArea;
                dy = 1;
            }

            // Find first tile with no info, first searching on horizontal axis *closest* to task area.
            // Then change axis moving outward (towards horizontal edge of the board) each outer loop iteration
            for (int y = startY; y != endY; y += dy)
                for (int x = startX; x <= endX; x++)
                    if (Board[x + y * Game.BoardSize.X].GoalStatus == GoalStatusEnum.NoInfo)
                    {
                        if (X - x > 0)
                            return Consts.Left;
                        if (X - x < 0)
                            return Consts.Right;
                        if (Y - y > 0)
                            return Consts.Up;
                        else
                            return Consts.Down;
                    }
            throw new InvalidOperationException("There seems to be no goal tiles left");
        }

        private int GetCurrentBoardIndex() => X + Game.BoardSize.X * Y;
        private bool IsInGoalArea() => (Y < Game.BoardSize.GoalArea || Y >= Game.BoardSize.GoalArea + Game.BoardSize.TaskArea);
        public bool Discover()
        {
            var message = new Message<DiscoveryPayload>()
            {
                Type = Consts.DiscoveryRequest,
                RecipientId = Consts.GameMasterId,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            // NOTE: let's think of a better solution that checking the message type each time
            // a message is received. Maybe create a method that would call `Receive`, deserialize the
            // message and check the type? It would reduce some chunks of repeated code.
            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.DiscoveryResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.DiscoveryResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<DiscoveryResponsePayload>>(receivedSerialized);

            if (received.Payload == null)
                throw new NoPayloadException();

            if (received.Payload.Tiles == null)
                throw new WrongPayloadException();

            foreach (var tileDTO in received.Payload.Tiles)
            {
                AutoMapper.Mapper.Map<TileDiscoveryDTO, Tile>(tileDTO, Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y]);
                Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y].Timestamp = received.Payload.Timestamp;
                if (tileDTO.Piece)
                {
                    Board[tileDTO.X + Game.BoardSize.X * tileDTO.Y].Piece = new Piece();
                }
            }
            return true;
        }

        public bool GetActionStatus()
        {
            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.ActionValid)
            {
                var received = JsonConvert.DeserializeObject<Message<ActionValidPayload>>(receivedSerialized);
                return true;

            }
            if (receivedRaw.Type == Consts.ActionInvalid)
            {
                var received = JsonConvert.DeserializeObject<Message<ActionInvalidPayload>>(receivedSerialized);
                logger.Warn("ACTION INVALID: {0}", received.Payload.Reason);
                return false;
            }
            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);


            throw new InvalidTypeReceivedException($"Expected: ACTION_VALID/INVALID Received: {receivedRaw.Type}");
        }

        public bool RefreshBoardState()
        {
            var message = new Message<RefreshStatePayload>()
            {
                Type = Consts.RefreshStateRequest,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            /**
            REFACTOR: do not rely on the fact that the first message you receive after you send one
            will be the response to your request. You may also receive a communication request.

            How about transforming the messages into a stream and filtering them? This way,
            you would subscribe to that message stream and listen for the first response that you
            expect here. It would be extensible since other parts of the system could listen
            to other types of messages and handle them, such as a component responsible for
            catching communication requests.
             */

            if (receivedRaw.Type != Consts.RefreshStateResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.RefreshStateResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<RefreshStateResponsePayload>>(receivedSerialized);
            if (received.Payload == null)
                throw new NoPayloadException();

            bool gotOwnInfo = false;
            if (received.Payload.PlayerPositions == null)
                throw new WrongPayloadException();
            foreach (var playerInfo in received.Payload.PlayerPositions)
            {
                // REFACTOR: how about changing the `Board` type to a class that wraps `List<Tile>`,
                // but also provides additional methods, such as updating the board based on the payload
                // of some requests?
                // TODO: Remove all (outdated) PlayerId attributes from board tiles
                Board[playerInfo.X + Game.BoardSize.X * playerInfo.Y].PlayerId = playerInfo.PlayerId;
                Board[playerInfo.X + Game.BoardSize.X * playerInfo.Y].Timestamp = received.Payload.Timestamp;
                if (playerInfo.PlayerId == Id)
                {
                    X = playerInfo.X;
                    Y = playerInfo.Y;
                    Board[GetCurrentBoardIndex()].DistanceToClosestPiece = received.Payload.CurrentPositionDistanceToClosestPiece;
                    gotOwnInfo = true;
                    if (Board[GetCurrentBoardIndex()].Piece == null && Board[GetCurrentBoardIndex()].DistanceToClosestPiece == 0)
                        Board[GetCurrentBoardIndex()].Piece = new Piece();
                }
            }

            if (!gotOwnInfo)
                throw new InvalidOperationException("No info about player");
            return true;
        }

        public bool Move(string direction)
        {
            int newX = X;
            int newY = Y;
            switch (direction)
            {
                case Consts.Up:
                    newY -= 1;
                    break;
                case Consts.Down:
                    newY += 1;
                    break;
                case Consts.Left:
                    newX -= 1;
                    break;
                case Consts.Right:
                    newX += 1;
                    break;
                default:
                    return false;
            }
            int index = newX + Game.BoardSize.X * newY;
            var message = new Message<MovePayload>()
            {
                Type = Consts.MoveRequest,
                SenderId = Id,
                Payload = new MovePayload
                {
                    Direction = direction
                }
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            logger.Debug("Moving {}", direction);

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.MoveResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.MoveResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<MoveResponsePayload>>(receivedSerialized);
            if (received.Payload == null)
                throw new NoPayloadException();

            Board[X + Game.BoardSize.X * Y].PlayerId = null;
            Board[index].PlayerId = Id;
            Board[index].DistanceToClosestPiece = received.Payload.DistanceToPiece;
            Board[index].Timestamp = received.Payload.TimeStamp;
            X = newX;
            Y = newY;
            return true;
        }

        public bool PickUpPiece()
        {
            var message = new Message<PickUpPiecePayload>
            {
                Type = Consts.PickupPieceRequest,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return false; }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.PickupPieceResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.PickupPieceResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<PickUpPieceResponsePayload>>(receivedSerialized);
            // if (received.Payload == null)
            //     throw new NoPayloadException();

            HeldPiece = Board[X + Game.BoardSize.X * Y].Piece;
            Board[X + Game.BoardSize.X * Y].Piece = null;

            logger.Info("Picked up piece @ ({}, {})", X, Y);
            return true;
        }

        public (bool, PlaceDownPieceResult) PlaceDownPiece()
        {
            var message = new Message<PlaceDownPiecePayload>
            {
                Type = Consts.PlaceDownPieceRequest,
                SenderId = Id
            };
            var messageSerialized = JsonConvert.SerializeObject(message);
            _communicator.Send(messageSerialized);

            if (!GetActionStatus()) { return (false, PlaceDownPieceResult.NoScore); }

            var receivedSerialized = _communicator.Receive();
            var receivedRaw = JsonConvert.DeserializeObject<Message>(receivedSerialized);

            if (receivedRaw.Type == Consts.GameFinished)
                GameAlreadyFinished(receivedSerialized);

            if (receivedRaw.Type != Consts.PlaceDownPieceResponse)
                throw new InvalidTypeReceivedException($"Expected: {Consts.PlaceDownPieceResponse} Received: {receivedRaw.Type}");

            var received = JsonConvert.DeserializeObject<Message<PlaceDownPieceResponsePayload>>(receivedSerialized);
            if (received.Payload == null)
                throw new NoPayloadException();

            Board[GetCurrentBoardIndex()].Piece = HeldPiece;
            HeldPiece = null;
            if (!received.Payload.DidCompleteGoal.HasValue
                 && (Y < Game.BoardSize.GoalArea
                || Y >= Game.BoardSize.GoalArea + Game.BoardSize.TaskArea))
            {
                Board[GetCurrentBoardIndex()].Piece.HasInfo = true;
                Board[GetCurrentBoardIndex()].Piece.IsSham = true;
                logger.Info("The piece was a sham!");
                return (true, PlaceDownPieceResult.Sham);
            }
            else if (!received.Payload.DidCompleteGoal.HasValue)
            {
                logger.Info("Placed a piece in Task Area");
                return (true, PlaceDownPieceResult.TaskArea);
            }
            else if (!received.Payload.DidCompleteGoal.Value)
            {
                logger.Info("This tile is not a goal tile");
                Board[GetCurrentBoardIndex()].GoalStatus = GoalStatusEnum.NoGoal;
                return (true, PlaceDownPieceResult.NoScore);
            }
            else
            {
                logger.Info($"Got 1 point for placing a piece @ {X} {Y}!");
                Board[GetCurrentBoardIndex()].GoalStatus = GoalStatusEnum.CompletedGoal;
                return (true, PlaceDownPieceResult.Score);
            }

        }
        public enum PlaceDownPieceResult
        {
            Sham = -1,
            NoScore = 0,
            Score = 1,
            TaskArea = 2
        }

        public void GameAlreadyFinished(string receivedMessageSerialized)
        {
            var received = JsonConvert.DeserializeObject<Message<GameFinishedPayload>>(receivedMessageSerialized);
            var winnerTeam = (received.Payload.Team1Score > received.Payload.Team2Score) ? "Team 1" : "Team 2";
            string message = $"Cannot perform the planned action. Game has already finished.\n" +
                $"Scores:\n\tTeam 1: {received.Payload.Team1Score}\n\tTeam 2: {received.Payload.Team2Score}\n" +
                $"Congratulations {winnerTeam}! WOOP WOOP!\n";

            throw new GameAlreadyFinishedException(message);
        }
    }
}
