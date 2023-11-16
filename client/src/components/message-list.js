import { useEffect, useRef } from "react";

// Энэ компонент руу логин хийсэн хэрэглэгч болон чатын бүх мэссэжүүдийг
// Chat компонентоос дамжуулсан байна.
function MessageList({ loggedUser, messages }) {
  // Бүх чатын гадуурх DIV-ийг энэ ref-ийг ашиглан аваад скролл хийхэд ашиглана.
  const containerRef = useRef();

  // useEffect ашиглан чат мэссэжүүд div дотор орж ирж бэлэн болсны дараа доошоо скроллдох хэсэг
  useEffect(() => {
    // Чатуудыг агуулсан DIV-ийг container хувьсагчид авч байна.
    const container = containerRef.current;
    // Хэрэв тийм DIV байвал доошоо нь тултал скролл хийнэ.
    // Учир нь хэдэн зуун мэссэж байвал хамгийн доорхийг нь үзүүлэхийн тулд ингэх шаардлагатай болно.
    if (container) {
      // Мэссэж лист доторх хамгийн сүүлийн мэссэжийг үзүүлэхийн тулд хамгийн доошоо scroll хийж очих
      container.scrollTo(0, container.scrollHeight);
    }
    // Мэссэжүүд нэмэгдвэл мөн л дахин доош скроллдоно.
  }, [messages]);

  // Чатын бүх мэссэжүүдийг map ашиглан давтаж MessageRow компонентоор table дотор үзүүлнэ.
  return (
    <div
      ref={containerRef}
      className="box"
      style={{ height: "50vh", overflowY: "scroll" }}
    >
      <table>
        <tbody>
          {messages.map((message) => (
            <MessageRow
              key={message.id}
              loggedUser={loggedUser}
              message={message}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Чатуудыг үзүүлэх table дээр нэг чатаыг <tr><td></td></tr> ашиглан харуулах компонент
// Энэ компонентод логин хийсэн хэрэглэгчийг дамжуулах ба хэрэв чатыг бичсэн хүн
// логин хийсэн хүн өөрөө мөн бол нэрийг нь НОГООНоор (is-primary класс) харуулна.
function MessageRow({ loggedUser, message }) {
  return (
    <tr>
      <td className="py-1">
        <span
          className={message.user === loggedUser ? "tag is-primary" : "tag"}
        >
          {message.user}
        </span>
      </td>
      <td className="pl-4 py-1">{message.text}</td>
    </tr>
  );
}

export default MessageList;
