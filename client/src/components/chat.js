import { useMutation, useQuery, useSubscription } from '@apollo/client';
import MessageInput from './message-input';
import MessageList from './message-list';
import { ADD_MESSAGE, ADD_MESSAGE_SUBSCRIPTION, GET_MESSAGES } from '../graphql/query';

function Chat({ loggedUser }) {
  // Сэрвэрээс бүх мэссэжүүдийг data.messages дээр авчирна.
  const { data } = useQuery(GET_MESSAGES);
  const messages = data?.messages ?? [];

  // AddMessage event-д бүртгүүлэх, ирсэн хариултыг хүлээж авах
  // AddMessage event register, and here also receive response notification from GraphQL server
  useSubscription(ADD_MESSAGE_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      console.log('Ирсэн мэссэж: ', data);

      const newMessage = data.data.message;

      // Update cache
      client.cache.updateQuery(
        {
          query: GET_MESSAGES,
        },
        (oldCache) => {
          return { messages: [...oldCache.messages, newMessage] };
        }
      );
    },
  });

  // Сэрвэр рүү шинэ чат мэссэжийг илгээх функцийг гаргаж авах
  const [mutate] = useMutation(ADD_MESSAGE);

  // Чатаа бичээд ENTER дарахад энэ функц ажиллана.
  const addMessage = async (text) => {
    // Сэрвэр рүү чат илгээх mutate функцийг дуудаад
    const { data } = await mutate({
      variables: { text },
    });
    return data;
  };

  const handleSend = async (text) => {
    const data = await addMessage(text);
    console.log('Илгээх мэссэж: ', data);
  };

  return (
    <section className='section'>
      <div className='container'>
        <h1 className='title is-4'>{`Нэвтэрсэн хэрэглэгч: ${loggedUser}`}</h1>
        <MessageList loggedUser={loggedUser} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
