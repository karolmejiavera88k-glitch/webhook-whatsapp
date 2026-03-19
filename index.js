const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔐 VARIABLES SEGURAS (Render)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "12345";
const TOKEN = process.env.TOKEN;

// 🔹 VERIFICACIÓN WEBHOOK
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

// 🔹 RECIBIR MENSAJES
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    const mensaje = data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    const numero = data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

    const texto = mensaje?.toLowerCase();

    console.log("Mensaje:", mensaje);
    console.log("Número:", numero);

    if (mensaje && numero) {

      let respuesta = "";

      // 🔹 OPCIONES DEL MENÚ
      if (texto === "1") {
        respuesta = `📍 Ferias en Bogotá:

🛍️ Centro Comercial Centro Mayor  
📅 26 marzo - 12 abril  

🛍️ Centro Comercial Hayuelos  
📅 27 marzo - 6 abril`;
      }

      else if (texto === "2") {
        respuesta = `🌎 Ferias Nacionales:

🛍️ Ibagué - Multicentro  
📅 21 marzo - 6 abril`;
      }

      else if (texto === "3") {
        respuesta = `🛍️ Pedido en Bogotá

Envíanos:
Producto + Cantidad + Dirección`;
      }

      else if (texto === "4") {
        respuesta = `🛍️ Pedido en Soacha

Envíanos:
Producto + Cantidad + Dirección`;
      }

      else if (texto === "5") {
        respuesta = `🛍️ Pedido en Chía

Envíanos:
Producto + Cantidad + Dirección`;
      }

      else if (texto === "6") {
        respuesta = `🛍️ Pedido en Mosquera, Funza y Madrid

Envíanos:
Producto + Cantidad + Dirección`;
      }

      else if (texto === "7") {
        respuesta = `🚚 Pedido en otras ciudades

Envíanos:
Ciudad + Producto + Cantidad`;
      }

      else if (texto === "8") {
        respuesta = `👩‍💼 Un asesor te atenderá en breve 🙌`;
      }

      // 🔥 MENSAJE INICIAL → ENVÍA PLANTILLA
      else {
        await fetch("https://graph.facebook.com/v22.0/1018727891330007/messages", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: numero,
            type: "template",
            template: {
              name: "saludo_cliente", // 👈 nombre exacto en Meta
              language: { code: "es_CO" }
            }
          })
        });

        return res.sendStatus(200);
      }

      // 🔹 RESPUESTA NORMAL
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

// 🔹 SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo 🚀"));
