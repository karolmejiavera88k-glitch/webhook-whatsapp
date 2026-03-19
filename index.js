app.post("/webhook", async (req, res) => {

  try {
    const mensaje = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
    const numero = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

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
          "Authorization": "Bearer EAAKWtJ1ySJABQZBkMQJqlks6NITJyLmDXZC0e9iVOBXQLXBw8LwFiuZAQbfHhK1XGTWX4kZBxaJhLia3nzwZBkQBJiZAzfYofT2Ycwz1oq2cgPqeYOfEiHjSj4drHMVOAgkG5Nt0BPmtof7eAxDNmsSTZAmWNUkUHxBHRpmsTgSVY7bK974o0YRq8bQC6rWEfcgdZCln6AZCNp5VZBtNaC0eskOZCJ4CGCe5M2MO9kuYS31IWkwVUT3I4m1Wp2fy1jknfX3ScDzAcvbzpHeDiPfQjgTn3ojxZBXEbYYa3ldB7wZDZD",
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
    console.error(error);
    res.sendStatus(500);
  }
});
