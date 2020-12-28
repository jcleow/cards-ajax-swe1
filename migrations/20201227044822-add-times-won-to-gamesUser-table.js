module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('GamesUsers', 'times_won', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('GamesUsers', 'times_won');
  },
};
