import "dotenv/config";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

// --- Schéma GraphQL ---
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    id: ID!
    title: String!
    content: String
    author: User!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
  }

  type Query {
    users: [User]
    posts: [Post]
    comments: [Comment]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createPost(title: String!, content: String, authorId: Int!): Post
    createComment(content: String!, postId: Int!, authorId: Int!): Comment
  }
`);

// --- Resolvers ---
const root = {
  users: () =>
    prisma.user.findMany({ include: { posts: true, comments: true } }),
  posts: () =>
    prisma.post.findMany({ include: { author: true, comments: true } }),
  comments: () =>
    prisma.comment.findMany({ include: { post: true, author: true } }),

  createUser: ({ name, email }) =>
    prisma.user.create({ data: { name, email } }),

  createPost: ({ title, content, authorId }) =>
    prisma.post.create({ data: { title, content, authorId } }),

  createComment: ({ content, postId, authorId }) =>
    prisma.comment.create({ data: { content, postId, authorId } }),
};

// --- Serveur Express ---
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // Interface de test
  })
);

app.listen(PORT, () =>
  console.log(`✅ Serveur GraphQL lancé sur http://localhost:${PORT}/graphql`)
);
