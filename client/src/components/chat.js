import { useMutation, useQuery } from '@apollo/client';
import MessageInput from './message-input';
import MessageList from './message-list';
import { ADD_MESSAGE, GET_MESSAGES } from '../graphql/query';

function Chat({ loggedUser }) {
  // Сэрвэрээс бүх мэссэжүүдийг data.messages дээр авчирна.
  const { data } = useQuery(GET_MESSAGES);
  const messages = data?.messages ?? [];
  // Сэрвэр рүү шинэ чат мэссэжийг илгээх функцийг гаргаж авах
  const [mutate] = useMutation(ADD_MESSAGE);

  // Чатаа бичээд ENTER дарахад энэ функц ажиллана.
  const addMessage = async (text) => {
    // Сэрвэр рүү чат илгээх mutate функцийг дуудаад
    const { data } = await mutate({
      variables: { text },
      update: (cache, { data }) => {
        const newMessage = data.message;
        cache.updateQuery(
          {
            query: GET_MESSAGES,
          },
          (oldCache) => {
            return { messages: [...oldCache.messages, newMessage] };
          }
        );
      },
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
