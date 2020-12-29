import sequelizePkg from 'sequelize';

const { Op } = sequelizePkg;
/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Stuff
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Stuff
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

export default function games(db) {
  // render the main page
  const displayMainPage = (request, response) => {
    response.render('games/index');
  };

  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // deal out a new shuffled deck for this game.
    const deck = shuffleCards(makeDeck());

    const newGame = {
      cards: {
        deck,
      },
    };
    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);
      const newGameRound = {
        GameId: game.id,
        UserId: Number(request.cookies.loggedInUserId),
        player_num: 1,
      };
      const gameRound = await db.GamesUser.create(newGameRound);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        cards: {
          playerHand: game.cards.playerHand,
        },
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // deal two new cards from the deck.
  const deal = async (request, response) => {
    try {
      // get the game by the ID passed in the request
      const game = await db.Game.findByPk(request.params.id);

      // make changes to the object
      const P1Card = game.cards.deck.pop();
      const P2Card = game.cards.deck.pop();
      const playerHand = [P1Card, P2Card];
      const { deck } = game.cards;

      // Track current round winner
      let currRoundWinner;

      // Track game status('ongoing' or 'gameOver')
      let gameStatus = 'ongoing';

      if (P1Card.rank > P2Card.rank) {
        currRoundWinner = 1;
      } else if (P2Card.rank > P1Card.rank) {
        currRoundWinner = 2;
      } else {
        currRoundWinner = 'none';
      }
      // First find the selected GameUser Round based where player_num = currRoundWinner
      // as long as currRoundWinner !== none
      if (currRoundWinner !== 'none') {
        const selectedGameUserRound = await db.GamesUser.findOne({
          where: {
            GameId: request.params.id,
            player_num: currRoundWinner,
          },
        });
        // Next update that round's score
        await selectedGameUserRound.update({
          score: selectedGameUserRound.score += 1,
        });
        // if user won 3 times, then the game ends
        if (selectedGameUserRound.score === 3) {
        // Update GamesUser table that P1 is the winner and P2 is the loser
          const endOfGame = await db.Game.findByPk(request.params.id);
          await endOfGame.update({ winner: selectedGameUserRound.UserId });
          gameStatus = 'gameOver';
        }

        // update the game with the new info
        await game.update({
          cards: {
            playerHand,
            deck,
          },
        });
      }

      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        cards: {
          playerHand: game.cards.playerHand,
        },
        currRoundWinner,
        gameStatus,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // For either user to refresh the game
  const refresh = async (request, response) => {
    const currentGame = await db.Game.findByPk(request.params.id);

    const P1Card = currentGame.cards.playerHand[0];
    const P2Card = currentGame.cards.playerHand[1];
    let currRoundWinner;
    if (P1Card.rank > P2Card.rank) {
      currRoundWinner = 1;
    } else if (P2Card.rank > P1Card.rank) {
      currRoundWinner = 2;
    } else {
      currRoundWinner = 'none';
    }
    currentGame.setDataValue('currRoundWinner', currRoundWinner);
    console.log(currentGame, 'currentGame-server');
    response.send({ currentGame });
  };

  // Index all on-going games
  const index = async (req, res) => {
    if (req.middlewareLoggedIn === true) {
      const allOngoingGamesArray = await db.Game.findAll({
        where: {
          winner: null,
        },
        include: {
          model: db.GamesUser,
          where: {
            UserId: req.cookies.loggedInUserId,
          },
        },
      });
      console.log(allOngoingGamesArray, 'allOngoingGamesArray');
      if (allOngoingGamesArray) {
        res.send(allOngoingGamesArray);
        return;
      }
    }
    res.send('no ongoing games/must be loggedin');
  };

  // Show the selected game
  const show = async (req, res) => {
    const selectedOngoingGame = await db.Game.findByPk(req.params.id);
    console.log(selectedOngoingGame, 'selectedOngoingGame');
    res.send(selectedOngoingGame);
  };

  // Get the existing score of P1 and P2
  const score = async (req, res) => {
    const player1Score = await db.GamesUser.findOne({
      where: {
        GameId: req.params.id,
        player_num: 1,
      },
    });

    const player2Score = await db.GamesUser.findOne({
      where: {
        GameId: req.params.id,
        player_num: 2,
      },
    });

    res.send({ player1Score, player2Score });
  };

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    displayMainPage,
    deal,
    create,
    refresh,
    index,
    show,
    score,
  };
}
