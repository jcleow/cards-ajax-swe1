import db from './models/index.mjs';
import users from './controllers/users.mjs';

// import your controllers here
import games from './controllers/games.mjs';

export default function routes(app) {
  const GamesController = games(db);

  // main page
  app.get('/', GamesController.index);

  // create a new game
  app.post('/games', GamesController.create);

  // update a game with new cards
  app.put('/games/:id/deal', GamesController.deal);

  const UsersController = users(db);
  app.get('/user', UsersController.show);
  app.post('/user/new', UsersController.create);
  app.post('/user/login', UsersController.login);
  app.get('/isUserAuthenticated', UsersController.checkIfUserAuthenticated);

  // get a random user and create a new entry in GamesUser table
  app.post('/user/random', UsersController.random);
}
