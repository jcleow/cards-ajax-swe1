import jsSHA from 'jssha';
import sequelizePkg from 'sequelize';
import convertUserIdToHash, { hashPassword } from '../helper.mjs';

const { Op } = sequelizePkg;

export default function users(db) {
  // To perform authentication of login when login button is pressed
  const login = async (req, res) => {
    console.log(req.body, 'req-body');
    try {
      const selectedUser = await db.User.findOne({
        where: {
          email: req.body.email,
        },
        attributes: ['id', 'password'],
      });

      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      shaObj.update(req.body.password);
      const hashedPasswordSupplied = shaObj.getHash('HEX');

      // Perform check if password entered is the same as the password stored
      if (hashedPasswordSupplied === selectedUser.password) {
        // update the user object's sessionLoggedIn to be
        selectedUser.sessionLoggedIn = true;
        await selectedUser.save();

        // Send cookie through response
        res.cookie('loggedInUserId', selectedUser.id);
        res.cookie('loggedInHash', convertUserIdToHash(selectedUser.id));
        res.send({ authenticated: true, loggedInUserId: selectedUser.id });
        return;
      }
      res.send({ authenticated: false });
    } catch (error) {
      console.log(error);
    }
  };

  // Get the user's loggedInUserId from cookies
  const show = async (req, res) => {
    if (req.cookies) {
      res.send({ loggedInUserId: Number(req.cookies.loggedInUserId) });
      return;
    }
    res.send('Not Logged In');
  };

  // Render a registration form for the user
  // const newForm = async (req, res) => {

  // };

  const checkIfUserAuthenticated = async (req, res) => {
    res.send(req.middlewareLoggedIn);
  };

  // Create/Start a new game
  const create = async (req, res) => {
    // query if the email already exists in the database
    try {
      const userEmail = await db.User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (userEmail) {
        res.send({ creationStatus: 'existing email' });
        return;
      }

      const newUser = await db.User.create({
        email: req.body.email,
        password: hashPassword(req.body.password),
      });

      if (newUser) {
        res.cookie('loggedInUserId', newUser.id);
        const loggedInHash = convertUserIdToHash(newUser.id);
        res.cookie('loggedInHash', loggedInHash);
        res.send({ creationStatus: 'success' });
        return;
      }
    } catch (error) {
      console.log(error);
      res.send({ creationStatus: 'failure' });
    }
  };

  // Choose a random player 2
  const random = async (req, res) => {
    const randomPlayer2 = await db.User.findOne({
      order: db.sequelize.random(),
      where: {

        [Op.not]: [
          {
            id: req.cookies.loggedInUserId,
          },
        ],
      },
    });

    // Create a new entry for the random second player in the table
    await db.GamesUser.create({
      GameId: req.body.id,
      UserId: randomPlayer2.id,
      player_num: 2,
    });
    res.send(randomPlayer2);
  };

  // Delete cookies and log user out
  const logout = async (req, res) => {
    // update user instance that it is logged out
    const currLoggedInUser = await db.User.findOne({
      where: {
        id: req.cookies.loggedInUserId,
        sessionLoggedIn: true,
      },
    });

    currLoggedInUser.sessionLoggedIn = false;
    currLoggedInUser.save();

    res.clearCookie('loggedInUserId');
    res.clearCookie('loggedInHash');

    res.send('User is logged out');
  };

  return {
    show, login, checkIfUserAuthenticated, create, random, logout,
  };
}
