import { ModelsInterface } from "../interfaces/ModelsInterface";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import * as Sequelize from "sequelize";

export interface PostAttributes {
  id?: number;
  title?: string;
  content?: string;
  photo?: string;
  author?: number;
  createAt?: string;
  updateAt?: string;
}

export interface PostInstance
  extends Sequelize.Instance<PostAttributes>,
    PostAttributes {}

export interface PostModel
  extends BaseModelInterface,
    Sequelize.Model<PostInstance, PostAttributes> {}

export default (
  sequelize: Sequelize.Sequelize,
  dataTypes: Sequelize.DataTypes
): PostModel => {
  const post: PostModel = sequelize.define<PostInstance, PostAttributes>(
    "Post",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: dataTypes.STRING,
        allowNull: false
      },
      content: {
        type: dataTypes.TEXT,
        allowNull: false
      },
      photo: {
        type: dataTypes.BLOB({
          length: "long"
        }),
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: "posts"
    }
  );

  post.associateModel = (models: ModelsInterface): void => {
    post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: "author",
        name: "author"
      }
    });
  };

  post.associate = (models: Sequelize.Models): void => {
    post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: "author",
        name: "author"
      }
    });
  };

  return post;
};
