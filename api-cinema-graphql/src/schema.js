import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    posts: [Post]
    critiques: [Critique]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    author: User!
  }

  type Film {
    id: ID!
    titre: String!
    annee: Int!
    duree: Int!
    genre: String!
    realisateur: Realisateur!
    critiques: [Critique]
  }

  type Realisateur {
    id: ID!
    nom: String!
    pays: String!
    films: [Film]
  }

  type Critique {
    id: ID!
    note: Int!
    texte: String!
    film: Film!
    auteur: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input FilmFilter {
    annee: Int
    genre: String
    limit: Int
    offset: Int
  }

  type Query {
    # Utilisateurs
    users: [User]
    user(id: Int!): User
    
    # Posts et commentaires
    posts: [Post]
    post(id: Int!): Post
    comments: [Comment]
    
    # Cinéma
    films(filter: FilmFilter): [Film]
    film(id: Int!): Film
    realisateurs: [Realisateur]
    realisateur(id: Int!): Realisateur
    critiques: [Critique]
  }

  type Mutation {
    # Authentification
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    
    # Posts et commentaires
    createPost(title: String!, content: String!): Post
    createComment(postId: Int!, content: String!): Comment
    
    # Cinéma
    createFilm(titre: String!, annee: Int!, duree: Int!, genre: String!, realisateurId: Int!): Film
    createRealisateur(nom: String!, pays: String!): Realisateur
    createCritique(filmId: Int!, note: Int!, texte: String!): Critique
  }
`);