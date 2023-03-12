import { Model, DataTypes, Optional, Association } from 'sequelize';
import { sequelize } from '../database';
import { User } from './user';

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// We have marked `userId` as optional here because we only need it during creation of post
type PostCreationAttributes = Optional<PostAttributes, 'id' | 'createdAt' | 'updatedAt'>

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<Post, User>;
  };
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
      tableName: 'posts',
      sequelize,
    }
  );  

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Post.sync({ force: false }).then(() => console.log("Post table created"));

export { Post, PostAttributes, PostCreationAttributes };
