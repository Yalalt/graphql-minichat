import { useState } from "react";
import { login } from "../lib/authentication";

function LoginForm({ setLoggedUser }) {
  // Хэрэглэгчийн оруулсан нэрийг энд хадгална
  const [username, setUsername] = useState("mask");
  // Хэрэглэгчийн бичсэн нууц үгийг энд хадгална
  const [password, setPassword] = useState("mask123");
  // Үүссэн алдааны мэдээллийг энд хадгална
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    // Формыг submit хийхийг хориглох
    event.preventDefault();
    // Шинээр логин хийж буй тул өмнө нь гарсан алдаануудыг арилгах
    setError(false);

    //Энэ login функц нь GraphQL сэрвэр рүү энэ хэрэглэгчийг логин хийлгэнэ.
    // Хэрэв хэрэглэгчийн мэдээлэл зөв бол сэрвэрээс ирсэн токенийг browser localstorage руу хадгална.
    const user = await login(username, password);
    console.log("Логин хэрэглэгч: ", user);

    if (user) {
      // Логин амжилттай болсон тул уг хэрэглэгчийн мэдээллийг state-дээ хадгалах
      setLoggedUser(user);
    } else {
      // Логин амжилтгүй болсон тул алдааны мэдээллийг үзүүлэх
      setError(true);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Чат руу орох</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Хэрэглэгчийн нэр</label>
            <div className="control">
              <input
                className="input"
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Нууц үг</label>
            <div className="control">
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="message is-danger">
              <p className="message-body">Логин амжилтгүй боллоо!</p>
            </div>
          )}
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-link">
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
