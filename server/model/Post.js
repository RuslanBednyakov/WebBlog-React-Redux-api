export default function (sequelize, DataTypes){

  const Post = sequelize.define('Post', {
    title: DataTypes.STRING(120),
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    content: DataTypes.STRING,
  },
  {
    tableName: 'posts',
    timestamps: false
  })
  
  Post.associate = function (models) {
    models.Post.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false,
        name: 'user_id'
      },
      targetKey: 'id'
    });
  };
    return Post;
  }