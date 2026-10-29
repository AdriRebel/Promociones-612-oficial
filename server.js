





const express = require("express");
const Stripe = require("stripe");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const stripe = Stripe("sk_test_tuClaveDeStripe"); // ⚠️ pon tu clave secreta aquí

const app = express();
app.use(bodyParser.json());
app.use(express.static(".")); // sirve index.html y style.css

// Crear sesión de pago
app.post("/checkout", async (req, res) => {
  const { tipo, precio, cantidad } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "mxn",
        product_data: { name: `Boleto ${tipo}` },
        unit_amount: precio * 100, // Stripe usa centavos
      },
      quantity: cantidad,
    }],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ url: session.url });
});

// Enviar boleto (ejemplo simplificado)
app.get("/success", async (req, res) => {
  const qr = await QRCode.toDataURL("boleto-" + Date.now());
  res.send(`<h1>¡Gracias por tu compra!</h1>
            <p>Aquí está tu boleto digital:</p>
            <img src="${qr}" style="width:200px">`);
});
// Servir archivos estáticos (tu index.html, css, imágenes)
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
