export default function (sequelize, DataTypes){

  const Follower = sequelize.define('Follower', {
    id: DataTypes.BIGINT,
    follower: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    following: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  },
  {
    tableName: 'followers',
    timestamps: false
  })

  Follower.associate = function (models) {

    models.Follower.belongsTo(models.User, {
      onDelete: "CASCADE",
      targetKey: 'id',
      foreignKey: 'follower',
      as: 'userFollower'
    });

    models.Follower.belongsTo(models.User, {
      onDelete: "CASCADE",
      targetKey: 'id',
      foreignKey: 'following',
      as: 'userFollowing'
    });
  };
  
  return Follower;
}