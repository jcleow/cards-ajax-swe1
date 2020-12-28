module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('GamesUsers', 'score', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('GamesUsers', 'player_num', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('GamesUsers', 'score');
    await queryInterface.removeColumn('GamesUsers', 'player_num');
  },
};
