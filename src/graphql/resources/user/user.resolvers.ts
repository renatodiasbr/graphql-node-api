import { DbConnection } from "./../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";

export const userResolvers = {
  User: {
    posts: (parent, args, context, info) => {
      const { first = 10, offset = 0 } = args;
      const { db }: { db: DbConnection } = context;
      return db.Post.findAll({
        where: { author: parent.get("id") },
        limit: first,
        offset
      });
    }
  },
  Query: {
    users: (parent, args, context, info) => {
      const { first = 10, offset = 0 } = args;
      const { db }: { db: DbConnection } = context;
      return db.User.findAll({ limit: first, offset });
    },
    user: (parent, args, context, info) => {
      const { id } = args;
      const { db }: { db: DbConnection } = context;
      return db.User.findById(id).then((user: UserInstance) => {
        if (!user) throw new Error(`User with id '${id}' not found.`);
        return user;
      });
    }
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      const { input } = args;
      const { db }: { db: DbConnection } = context;
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.create(input, { transaction: t });
      });
    },
    updateUser: (parent, args, context, info) => {
      let { id, input } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.findById(id).then((user: UserInstance) => {
          if (!user) throw new Error(`User with id '${id}' not found.`);
          return user.update(input, { transaction: t });
        });
      });
    },
    updateUserPassword: (parent, args, context, info) => {
      let { id, input } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.findById(id).then((user: UserInstance) => {
          if (!user) throw new Error(`User with id '${id}' not found.`);
          return user
            .update(input, { transaction: t })
            .then((user: UserInstance) => !!user);
        });
      });
    },
    deleteUser: (parent, args, context, info) => {
      let { id } = args;
      const { db }: { db: DbConnection } = context;
      id = parseInt(id);
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.findById(id).then((user: UserInstance) => {
          if (!user) throw new Error(`User with id '${id}' not found.`);
          return user.destroy({ transaction: t }).then(() => true);
        });
      });
    }
  }
};
