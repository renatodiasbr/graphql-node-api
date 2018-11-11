import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";
import { Transaction } from "sequelize";

export const commentResolvers = {
  Comment: {
    user: (parent, args, context, info) => {
      const { db }: { db: DbConnection } = context;
      return db.User.findById(parent.get("user"));
    },
    post: (parent, args, context, info) => {
      const { db }: { db: DbConnection } = context;
      return db.Comment.findById(parent.get("post"));
    }
  },
  Query: {
    commentsByPost: (parent, args, context, info) => {
      let { post, first = 10, offset = 0 } = args;
      post = parseInt(post);
      const { db }: { db: DbConnection } = context;
      return db.Comment.findAll({
        where: { post },
        limit: first,
        offset
      });
    }
  },
  Mutation: {
    createComment: (parent, args, context, info) => {
      const { input } = args;
      const { db }: { db: DbConnection } = context;
      return db.sequelize.transaction((t: Transaction) => {
        return db.Post.create(input, { transaction: t });
      });
    },
    updateComment: (parent, args, context, info) => {
      let { id, input } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment.findById(id).then((comment: CommentInstance) => {
          if (!comment) throw new Error(`Comment with id '${id}' not found.`);
          return comment.update(input, { transaction: t });
        });
      });
    },
    deleteComment: (parent, args, context, info) => {
      let { id } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment.findById(id).then((comment: CommentInstance) => {
          if (!comment) throw new Error(`Comment with id '${id}' not found.`);
          return comment.destroy({ transaction: t }).then(() => true);
        });
      });
    }
  }
};
