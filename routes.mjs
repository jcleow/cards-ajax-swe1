import db from './models/index.mjs';
import convertUserIdToHash from './helper.mjs';
// import your controllers here
import users from './controllers/users.mjs';
import games from './controllers/games.mjs';

export default function routes(app) {
  // App wide authentication (without SALT)
  app.use(async (req, res, next) => {
    req.middlewareLoggedIn = false;

    if (req.cookies.loggedInUserId) {
      const hash = convertUserIdToHash(req.cookies.loggedInUserId);

      if (req.cookies.loggedInHash === hash) {
        req.middlewareLoggedIn = true;
      }

      const { loggedInUserId } = req.cookies;
      // Find this user in the database
      const chosenUser = await db.User.findOne({
        where: {
          id: loggedInUserId,
        },
      });
      if (!chosenUser) {
        res.status(503).send('sorry an error has occurred');
      }
      console.log(chosenUser, 'chosenUser');
      req.middlewareLoggedIn = true;
      next();
      return;
    }
    next();
  });

  const GamesController = games(db);
  // main page
  app.get('/', GamesController.displayMainPage);
  // show if there are any existing games
  app.get('/games', GamesController.index);
  // get selected game
  app.get('/games/:id', GamesController.show);
  // get selected game score
  app.get('/games/:id/score', GamesController.score);
  // create a new game
  app.post('/games', GamesController.create);
  // update a game with new cards
  app.put('/games/:id/deal', GamesController.deal);
  // // refresh page to get current status of game
  // app.get('/currentGameStatus/:id', GamesController.show);

  const UsersController = users(db);
  app.get('/user', UsersController.show);
  app.post('/user/new', UsersController.create);
  app.post('/user/login', UsersController.login);
  app.put('/user/logout', UsersController.logout);
  app.get('/isUserAuthenticated', UsersController.checkIfUserAuthenticated);

  // get a random user and create a new entry in GamesUser table
  app.post('/user/random', UsersController.random);
}
