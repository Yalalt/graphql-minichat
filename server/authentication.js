import { expressjwt } from "express-jwt";
import { getUser } from "./controllers/user.js";
import jwt from "jsonwebtoken";

// Токен үүсгэхэд ашиглах нууц тэмдэгтүүд, энэ тэмдэгтийг алдвал хакердуулах боломжтой болно.
const secret = "IiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJqb2dobkBnbW";

//
export const authenticationMiddleware = expressjwt({
  algorithms: ["HS256"],
  secret,
  credentialsRequired: false,
});

export const decodeToken = (token) => {
  return jwt.decode(token, secret);
}

export async function handleLogin(req, res) {
  // хэрэглэгчийн нэр, password салгаж авах
  const { username, password } = req.body;

  // Хэрэглэгчийг нэрээр нь базаас шүүж авах
  const user = await getUser(username);

  // Шүүсэн хэрэглэгчийн нууц үг нь ирсэн нууц үгтэй тэнцүү эсэх
  // Тэнцүү биш бол олдсонгүй response буцаах
  if (!user || user.password !== password) {
    return res.sendStatus(401);
  }

  // Тэнцүү бол токенийг sign хийж үүсгээд response руу хийж буцаах
  const data = { sub: username };
  const token = jwt.sign(data, secret);

  res.json({ token });
}
