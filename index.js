const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "12345"; // el mismo de Meta
const TOKEN = "EAAKWtJ1ySJABQzZCe43MDli6M0WVDymC0cARFWWl5OimosmeOxVSnadpWAjYv9nR88wQUzpN4QQXS40aiPwnZCihIQP5X6e2OqwNtYH7fjmmPZAZAZBxDJfyBshhv86HEnhuerhdo5JBmN5IvvmKxTerzbZAuLE66u4prhDkh3CNh6yxxFHJt2bnlDkIGznQq4ZCkjBhTeRZAEZCqOFsODFXy8MfCbgvcVJ1H0SKi4YU3lKwL0WHEZClgzOrNbYQG6ZAQsLZCIk6x0zEQZCT2iao41zhgWD9XGDJ0kY6mLMMaOQZDZD";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const mensaje = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    const numero = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

    console.log("Mensaje:", mensaje);
    console.log("Número:", numero);

    if (mensaje && numero) {

      let respuesta = "";

      if (mensaje === "1") {
        respuesta = "🍯 Aquí puedes ver nuestro catálogo:\nhttps://tus-productos.com";
      } 
      else if (mensaje === "2") {
        respuesta = "📍 Estamos en estas ferias:\n- Feria Medellín\n- Expo Dulces";
      } 
      else if (mensaje === "3") {
        respuesta = "🔥 Promociones actuales:\n2x1 en arequipe";
      } 
      else if (mensaje === "4") {
        respuesta = "👩‍💼 Un asesor te contactará pronto";
      } 
      else {
        respuesta = `Hola 👋 gracias por comunicarte con Dulces de Leche Meve 🍯

Estamos felices de atenderte 😊

Por favor indícanos qué deseas:

1️⃣ Ver catálogo y Comprar  
2️⃣ Ferias actuales  
3️⃣ Promociones  
4️⃣ Hablar con un asesor`;
      }

      await fetch("https://graph.facebook.com/v22.0/1018727891330007/messages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: numero,
          type: "text",
          text: { body: respuesta }
        })
      });
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("ERROR:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Servidor listo 🚀"));
