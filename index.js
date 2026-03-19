const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔐 TOKENS SEGUROS (desde Render)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "12345";
const TOKEN = process.env.TOKEN;

// 🔹 Verificación webhook
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

// 🔹 Recepción de mensajes
app.post("/webhook", async (req, res) => {
  try {
    const mensaje = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    const numero = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

    const texto = mensaje?.toLowerCase();

    console.log("Mensaje:", mensaje);
    console.log("Número:", numero);

    if (mensaje && numero) {

      let respuesta = "";

      // OPCIÓN 1
      if (texto === "1") {
        respuesta = `📍 *Ferias en Bogotá*

🛍️ Centro Comercial Centro Mayor  
📅 26 marzo - 12 abril  
⏰ 10am - 8pm

🛍️ Centro Comercial Hayuelos  
📅 27 marzo - 6 abril  
⏰ 10am - 8pm`;
      }

      // OPCIÓN 2
      else if (texto === "2") {
        respuesta = `🌎 *Ferias Nacionales*

🛍️ Ibagué - Multicentro  
📅 21 marzo - 6 abril  
⏰ 10am - 8pm`;
      }

      // OPCIÓN 3
      else if (texto === "3") {
        respuesta = `🛍️ Pedido en Bogotá

Envíanos:
Producto + Cantidad + Dirección`;
      }

      // OPCIÓN 4
      else if (texto === "4") {
        respuesta = `🛍️ Pedido en Soacha

Envíanos:
Producto + Cantidad + Dirección`;
      }

      // OPCIÓN 5
      else if (texto === "5") {
        respuesta = `🛍️ Pedido en Chía

Envíanos:
Producto + Cantidad + Dirección`;
      }

      // OPCIÓN 6
      else if (texto === "6") {
        respuesta = `🛍️ Pedido en Mosquera, Funza y Madrid

Envíanos:
Producto + Cantidad + Dirección`;
      }

      // OPCIÓN 7
      else if (texto === "7") {
        respuesta = `🚚 Envíos a otras ciudades

Envíanos:
Ciudad + Producto + Cantidad`;
      }

      // OPCIÓN 8
      else if (texto === "8") {
        respuesta = `👩‍💼 Un asesor te atenderá pronto`;
      }

      // MENÚ PRINCIPAL
      else {
        respuesta = `Hola 👋 Bienvenido a Dulces de Leche Meve 🍯

Elige una opción:

1️⃣ Ferias Bogotá  
2️⃣ Ferias Nacional  
3️⃣ Pedido Bogotá  
4️⃣ Pedido Soacha  
5️⃣ Pedido Chía  
6️⃣ Pedido Mosquera/Funza/Madrid  
7️⃣ Otras ciudades  
8️⃣ Asesor`;
      }

      // 🔹 ENVÍO A WHATSAPP
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

// 🔹 Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo 🚀"));
