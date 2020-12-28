const jsSHA = require('jssha');

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update('password');
    const hashedPassword = shaObj.getHash('HEX');
    const usersList = [
      {
        email: 'user@email.com',
        password: hashedPassword,
        sessionLoggedIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        email: 'user2@email.com',
        password: hashedPassword,
        sessionLoggedIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('Users', usersList);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
