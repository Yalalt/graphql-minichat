// Энэ компонент руу мэссэжийг сэрвэр рүү илгээх onSend функц дамжигдаж орж ирж байна.
function MessageInput({ onSend }) {
  // Чат бичих хэсэгт үсэг бичих болгонд энэ функц дуудагдана.
  const handleKeyDown = (event) => {
    // Enter дарсан бол текстийг сэрвэр рүү илгээнэ.
    if (event.key === "Enter") {
      // Сэрвэр рүү текстийг илгээх
      onSend(event.target.value);
      // Илгээсний дараа бичсэн текстийг хоослоно.
      event.target.value = "";
    }
  };

  return (
    <div className="box">
      <div className="control">
        <input
          className="input"
          type="text"
          placeholder="Энд бичнэ үү..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default MessageInput;
