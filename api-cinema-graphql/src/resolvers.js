import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonctions auth temporaires pour tester
const hashPassword = async (password) => {
  return password + '_hashed'; // Temporaire pour test
};

const generateToken = (userId) => {
  return 'token_temporaire_' + userId; // Temporaire pour test
};

export const resolvers = {
  // QUERIES
  users: async () => {
    return await prisma.user.findMany();
  },

  posts: async () => {
    return await prisma.post.findMany({
      include: { author: true, comments: true }
    });
  },

  films: async ({ filter = {} }) => {
    const { limit = 10, offset = 0 } = filter;
    return await prisma.film.findMany({
      skip: offset,
      take: limit,
      include: { realisateur: true, critiques: true }
    });
  },

  // MUTATIONS
  register: async ({ name, email, password }) => {
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    const token = generateToken(user.id);
    
    return { token, user };
  },

  login: async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur non trouvé');
    
    const token = generateToken(user.id);
    return { token, user };
  },

  createRealisateur: async ({ nom, pays }) => {
    return await prisma.realisateur.create({
      data: { nom, pays }
    });
  },

  createFilm: async ({ titre, annee, duree, genre, realisateurId }) => {
    return await prisma.film.create({
      data: {
        titre,
        annee,
        duree,
        genre,
        realisateurId
      },
      include: { realisateur: true }
    });
  }
};