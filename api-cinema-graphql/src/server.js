import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";

const app = express();
const PORT = 4000;

// Middleware simple pour tester
app.use(express.json());

// Middleware GraphQL CORRIGÉ
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true  // Active l'interface GraphQL
}));

// Route de test
app.get('/', (req, res) => {
  res.send('🚀 Serveur GraphQL en marche ! Allez sur /graphql');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
});