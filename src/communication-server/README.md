# Communication Server

Communication Server is the entity that bridges players and the Game Master. It routes messages
between them and announces when an entity has disconnected.

It also makes sure that messages from players have correct `senderId`s and that players
handshake first before they send actual messages.

Unlike GM and players, it does not have a special UI. Instead, is just logs simple messages
to the console.

The server assumes that the first client to connect to it is the Game Master.
