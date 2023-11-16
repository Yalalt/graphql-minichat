import { GraphQLError } from 'graphql';
import { createMessage, getMessages } from './controllers/messages.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    // Чат руу логин хийж ороход чат дээр үзэгдэх бүх мэссэжийг энэ resolver клиентад өгнө.
    messages: (_root, _args, { user }) => {
      if (!user) throwUnauthenicated();
      return getMessages();
    },
  },

  Mutation: {
    // Клиент шинээр мэссэж бичих бүрт энэ resolver дуудагдаж мэссэжийг Sqlite базд бичнэ.
    addMessage: (_root, { text }, { user }) => {
      if (!user) throwUnauthenicated();
      const newMessage = createMessage(user, text);
      pubsub.publish('CHAT_RECEIVED', { messageAdded: newMessage });
      return newMessage;
    },
  },

  // Messages дээр дуудагдсан бүх мэссэжийг хэрэглэгчид нь харуулах боломжтой болгоно.
  Subscription: {
    messageAdded: {
      // Async iterator return
      subscribe: () => pubsub.asyncIterator('CHAT_RECEIVED'),
    },
  },
};

// Хэрэглэгч логин хийгээгүй (ө.х логин токен дамжуулаагүй) бол энэ алдааны мэдээллийг чат апп руу буцаана.
function throwUnauthenicated() {
  throw new GraphQLError('Логин хийгээгүй байна.', {
    extensions: { code: 'UNAUTHENTICATED' },
  });
}
