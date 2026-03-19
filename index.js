const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "12345";
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

    const texto = mensaje?.toLowerCase();

    console.log("Mensaje:", mensaje);
    console.log("Número:", numero);

    if (mensaje && numero) {

      let respuesta = "";

      // 🔹 OPCIÓN 1
      if (texto === "1") {
        respuesta = `📍 *Ferias en Bogotá*

🛍️ *Centro Comercial Centro Mayor*  
📍 Plazoleta principal  
📅 26 de marzo al 12 de abril  
⏰ 10:00 a.m. a 8:00 p.m.

🛍️ *Centro Comercial Hayuelos*  
📍 Frente a Kevin's Joyeros  
📅 27 de marzo al 6 de abril  
⏰ 10:00 a.m. a 8:00 p.m.

👉 ¿Te gustaría visitarnos o prefieres hacer tu pedido por aquí? 😊`;
      }

      // 🔹 OPCIÓN 2
      else if (texto === "2") {
        respuesta = `🌎 *Ferias a nivel nacional*

🛍️ *Ibagué - Centro Comercial Multicentro*  
📍 Segundo piso, frente a Banco AV Villas  
📅 21 de marzo al 6 de abril  
⏰ 10:00 a.m. a 8:00 p.m.

👉 ¿Te gustaría visitarnos o prefieres hacer tu pedido por aquí? 😊`;
      }

      // 🔹 OPCIÓN 3
      else if (texto === "3") {
        respuesta = `🛍️ *Pedido en Bogotá*

Envíanos:

👉 Producto  
👉 Cantidad  
👉 Dirección  

y te ayudamos con tu pedido 💛`;
      }

      // 🔹 OPCIÓN 4
      else if (texto === "4") {
        respuesta = `🛍️ *Pedido en Soacha*

Envíanos:

👉 Producto  
👉 Cantidad  
👉 Dirección  

y coordinamos tu pedido 🚚`;
      }

      // 🔹 OPCIÓN 5
      else if (texto === "5") {
        respuesta = `🛍️ *Pedido en Chía*

Dinos:

👉 Producto  
👉 Cantidad  
👉 Dirección  

y te cotizamos envío 💛`;
      }

      // 🔹 OPCIÓN 6
      else if (texto === "6") {
        respuesta = `🛍️ *Pedido en Mosquera, Funza y Madrid*

Envíanos:

👉 Producto  
👉 Cantidad  
👉 Dirección  

y te confirmamos disponibilidad 🚚`;
      }

      // 🔹 OPCIÓN 7
      else if (texto === "7") {
        respuesta = `🚚 *Pedido en otras ciudades*

Hacemos envíos a nivel nacional 🇨🇴

Escríbenos:

👉 Ciudad  
👉 Producto  
👉 Cantidad  

y te damos el valor del envío 📦`;
      }

      // 🔹 OPCIÓN 8
      else if (texto === "8") {
        respuesta = `👩‍💼 *Asesor*

Un asesor te atenderá en breve 🙌

También puedes escribir tu pedido directamente aquí`;
      }

      // 🔹 MENÚ PRINCIPAL
      else {
        respuesta = `Hola 👋 gracias por comunicarte con *Dulces de Leche Meve* 🍯

Estamos felices de atenderte 😊

Por favor elige una opción:

1️⃣ Ferias en Bogotá 📍  
2️⃣ Ferias a nivel nacional 🌎  
3️⃣ Pedido en Bogotá 🛍️  
4️⃣ Pedido en Soacha 🛍️  
5️⃣ Pedido en Chía 🛍️  
6️⃣ Pedido en Mosquera, Funza y Madrid 🛍️  
7️⃣ Pedido en otras ciudades 🚚  
8️⃣ Hablar con un asesor 👩‍💼  

✍️ Escribe el número de la opción`;
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
