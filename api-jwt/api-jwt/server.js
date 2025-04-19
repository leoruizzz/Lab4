const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "tu_clave_secreta";

const users = [
  {
    id: 1,
    email: "leo_lopez27nogales@hotmail.com",
    password: bcrypt.hashSync("ronaldo123", 10),
  },
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token });
});

app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Acceso permitido", data: decoded });
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
});

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
