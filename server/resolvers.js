import { GraphQLError } from "graphql";
import { createMessage, getMessages } from "./controllers/messages.js";

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
      return createMessage(user, text);
    },
  },
};

// Хэрэглэгч логин хийгээгүй (ө.х логин токен дамжуулаагүй) бол энэ алдааны мэдээллийг чат апп руу буцаана.
function throwUnauthenicated() {
  throw new GraphQLError("Логин хийгээгүй байна.", {
    extensions: { code: "UNAUTHENTICATED" },
  });
}
