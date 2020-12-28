export default function gamesUserModel(sequelize, DataTypes) {
  return sequelize.define('GamesUser', {
    result: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    player_num: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
  });
}
