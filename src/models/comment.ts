import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import User from './user';
import { Post } from './post';

class Comment extends Model {
  public id!: number;
  public content!: string;
  public postId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly post?: Post;
  public readonly user?: User;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: 'comments',
    sequelize,
  }
);

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Comment.sync({ force: false }).then(() => console.log("Comment table created"));

export default Comment;
