import { commentResolvers } from "./resources/comment/comment.resolvers";
import { userResolvers } from "./resources/user/user.resolvers";
import { makeExecutableSchema } from "graphql-tools";
import { Query } from "./query";
import { Mutation } from "./mutation";
import { userTypes } from "./resources/user/user.schema";
import { postTypes } from "./resources/post/post.schema";
import { commentTypes } from "./resources/comment/comment.schema";
import { merge } from "lodash";
import { postResolvers } from "./resources/post/post.resolvers";

const SchemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    Mutation,
    postTypes,
    userTypes,
    commentTypes
  ],
  resolvers: merge(userResolvers, postResolvers, commentResolvers)
});
