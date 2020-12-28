module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('GamesUsers', 'score', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('GamesUsers', 'score');
  },
};
