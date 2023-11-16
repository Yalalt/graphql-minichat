import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloExpressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authenticationMiddleware, handleLogin } from './authentication.js';
import { resolvers } from './resolvers.js';

import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';

// Ажлын зар төсөлтэй зэрэг ажиллуулах боломжтой байлгахын тулд 9001 порт дээр ажиллуулцгаая.
const PORT = 9001;
const app = express();
const httpServer = createServer(app);

// Чатын аппаас энэ сэрвэр рүү илгээсэн хүсэлтийг авах боломжийг нээнэ.
app.use(
  cors({ origin: ['http://localhost:3001', 'http://127.0.0.1:3001'] }),
  // Чатын аппын ирсэн хүсэлтийн body доторх json text мэдээллийг json object болгон request обьект дотор шигтгэж өгнө.
  express.json()
);

// Чатын аппаас логин хүсэлтийг энд барьж авч логин хийнэ.
app.post('/login', handleLogin);

// Schema-аа файлаас уншиж авах
const typeDefs = await readFile('./schema.graphql', 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create web socket Server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// WebSocket Server listening
const serverCleanup = useWsServer({ schema }, wsServer);

// Аполло сэрвэрийг бэлтгэх
const apolloServer = new ApolloServer({
  schema,
  // HTTP server proper shutdown хийхийн тулд
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      // WebSocket server proper shutdown хийхийн тулд
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
await apolloServer.start();

app.use(
  '/graphql',
  // Чатын клиентаас ирсэн бүх хүсэлтийг боловсруулахын өмнө эхлээд логин хийсэн эсэхийг authenticationMiddleware шалгана.
  authenticationMiddleware,
  // Логин хийсэн бол Аполло сэрвэр рүү уг хүсэлтийг логин хийсэн хэрэглэгчийн мэдээллийг context-руу хийгээд дамжуулна.
  apolloExpressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const context = {};
      if (req.auth) {
        return { user: req.auth.sub };
      }
      return context;
    },
  })
);

// Express сэрвэрийг 9001 порт дээр асааж байна.
// Express сэрвэр нь /login хүсэлтээр орж ирсэн хүсэлтийг боловсруулж мэдээлэл зөв бол токен үүсгэж чат апп руу илгээнэ.
// Express сэрвэр нь /graphql endpoint-оор орж ирсэн бүх хүсэлтийг Аполло сэрвэр рүү дамжуулна.
httpServer.listen({ port: PORT }, () => {
  console.log(`HTTP сэрвэр ажиллаж байна: http://localhost:${PORT}`);
  console.log(`Apollo graphql ЧАТ сэрвэр: http://localhost:${PORT}/graphql`);
  console.log(`WebSocket ЧАТ сэрвэр: ws://localhost:${PORT}/graphql`);
});

