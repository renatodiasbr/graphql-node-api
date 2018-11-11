import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";

export const postResolvers = {
  Post: {
    author: (parent, args, context, info) => {
      const { db }: { db: DbConnection } = context;
      return db.User.findById(parent.get("author"));
    },
    coments: (parent, args, context, info) => {
      const { first = 10, offset = 0 } = args;
      const { db }: { db: DbConnection } = context;
      return db.Comment.findAll({
        where: { post: parent.get("id") },
        limit: first,
        offset
      });
    }
  },
  Query: {
    posts: (parent, args, context, info) => {
      const { first = 10, offset = 0 } = args;
      const { db }: { db: DbConnection } = context;
      return db.Post.findAll({ limit: first, offset });
    },
    post: (parent, args, context, info) => {
      const { id } = args;
      const { db }: { db: DbConnection } = context;
      return db.Post.findById(id).then((post: PostInstance) => {
        if (!post) throw new Error(`Post with id '${id}' not found.`);
        return post;
      });
    }
  },
  Mutation: {
    createPost: (parent, args, context, info) => {
      const { input } = args;
      const { db }: { db: DbConnection } = context;
      return db.sequelize.transaction((t: Transaction) => {
        return db.Post.create(input, { transaction: t });
      });
    },
    updatePost: (parent, args, context, info) => {
      let { id, input } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Post.findById(id).then((post: PostInstance) => {
          if (!post) throw new Error(`Post with id '${id}' not found.`);
          return post.update(input, { transaction: t });
        });
      });
    },
    deletePost: (parent, args, context, info) => {
      let { id } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.Post.findById(id).then((post: PostInstance) => {
          if (!post) throw new Error(`Post with id '${id}' not found.`);
          return post.destroy({ transaction: t }).then(() => true);
        });
      });
    }
  }
};
