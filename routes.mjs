import db from './models/index.mjs';
import users from './controllers/users.mjs';

// import your controllers here
import games from './controllers/games.mjs';

export default function routes(app) {
  const GamesController = games(db);

  // main page
  app.get('/', GamesController.displayMainPage);
  // show if there are any existing games
  app.get('/games', GamesController.index);
  // get selected game
  app.get('/games/:id', GamesController.show);
  // create a new game
  app.post('/games', GamesController.create);
  // update a game with new cards
  app.put('/games/:id/deal', GamesController.deal);
  // refresh page to get current status of game
  app.get('/currentGameStatus/:id', GamesController.refresh);

  const UsersController = users(db);
  app.get('/user', UsersController.show);
  app.post('/user/new', UsersController.create);
  app.post('/user/login', UsersController.login);
  app.put('/user/logout', UsersController.logout);
  app.get('/isUserAuthenticated', UsersController.checkIfUserAuthenticated);

  // get a random user and create a new entry in GamesUser table
  app.post('/user/random', UsersController.random);
}
