
// VARIABLES

// Use ws module for handling websockets
const ws = require('ws');

// Custom modules
const game = require('./game');
const socket_handler = require('./socket_handler');
const database = require('./database');
// const database = require('./offlinedb'); // For use when database is down

// Settings
const SERV_DATA = {
  port: process.env.PORT || 80,
  show_heartbeat: false,
  heartbeat_frequency: 3000
};
const DB_DATA = {
  host: "remotemysql.com",
  user: "c1uDVliS0M",
  password: "APlVfT4Lwj",
  database: "c1uDVliS0M"
};

// Start database connection
database.connect(DB_DATA, function() {

  // Print leaderboard
  database.leaderboard(function(results) {
    console.log('LEADERBOARD:');
    for (var i in results) {
      console.log(' - ' + results[i].userName + ': ' + results[i].highscore);
    }
  });

  // Start server
  console.log('SERVER STARTING...');
  const server = new ws.Server({ port: SERV_DATA.port });
  console.log('SERVER INITIALISED ON PORT ' + SERV_DATA.port);

  // Setup socket handler
  socket_handler.initialise(SERV_DATA, database, server, game);
  server.on('connection', socket_handler.connect);

  // Run
  game.start(database);

});
