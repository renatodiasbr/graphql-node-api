import { ModelsInterface } from "./../interfaces/ModelsInterface";
import { BaseModelInterface } from "./../interfaces/BaseModelInterface";
import * as Sequelize from "sequelize";

export interface CommentAttributes {
  id?: number;
  comment?: string;
  post?: number;
  user?: number;
  createAt?: string;
  updateAt?: string;
}

export interface CommentInstance
  extends Sequelize.Instance<CommentAttributes>,
    CommentAttributes {}

export interface CommentModel
  extends BaseModelInterface,
    Sequelize.Model<CommentInstance, CommentAttributes> {}

export default (
  sequelize: Sequelize.Sequelize,
  dataTypes: Sequelize.DataTypes
): CommentModel => {
  const comment: CommentModel = sequelize.define<
    CommentInstance,
    CommentAttributes
  >(
    "Comment",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      comment: {
        type: dataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: "comments"
    }
  );

  comment.associateModel = (models: ModelsInterface): void => {
    comment.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false,
        field: "post",
        name: "post"
      }
    });
    comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: "user",
        name: "user"
      }
    });
  };

  comment.associate = (models: Sequelize.Models): void => {
    comment.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false,
        field: "post",
        name: "post"
      }
    });
    comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: "user",
        name: "user"
      }
    });
  };

  return comment;
};
