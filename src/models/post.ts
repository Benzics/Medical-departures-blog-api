import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";
import { User } from "./user";

export class Post extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    content: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    tableName: "posts",
    sequelize,
  }
);

// Define associations between User and Post models
User.hasMany(Post);
Post.belongsTo(User);

Post.sync({ force: false }).then(() => console.log("Post table created"));

export default Post;
