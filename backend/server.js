import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Resend } from "resend";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const toEmail = process.env.RESEND_TO_EMAIL;

console.log("FROM:", fromEmail);
console.log("TO:", toEmail);

if (!resendApiKey) {
  console.error("Missing RESEND_API_KEY in .env");
  process.exit(1);
}

if (!fromEmail) {
  console.error("Missing RESEND_FROM_EMAIL in .env");
  process.exit(1);
}

if (!toEmail) {
  console.error("Missing RESEND_TO_EMAIL in .env");
  process.exit(1);
}

const resend = new Resend(resendApiKey);

app.post("/send-email", async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "O campo de email é obrigatório.",
    });
  }

  try {
    console.log("Email do cliente:", email);

    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `Novo contato de ${name || "Pessoa"}${
        company ? ` — ${company}` : ""
      }`,
      html: `
        <h1>Novo contato recebido</h1>

        <p><strong>Nome:</strong> ${name || "Não informado"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || "Não informada"}</p>
        <p><strong>Telefone:</strong> ${phone || "Não informado"}</p>

        <hr />

        <h2>Mensagem</h2>
        <p>${message || "Sem mensagem."}</p>

        <hr />

        <p>
          Clique em "Responder" no seu email para responder diretamente ao cliente.
        </p>
      `,
      text: `
Novo contato recebido

Nome: ${name || "Não informado"}
Email: ${email}
Empresa: ${company || "Não informada"}
Telefone: ${phone || "Não informado"}

Mensagem:
${message || "Sem mensagem."}

Clique em responder para falar diretamente com o cliente.
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);

      return res.status(500).json({
        success: false,
        error: result.error.message,
      });
    }

    console.log("Resend send result:", result);

    return res.status(200).json({
      success: true,
      message: "Email enviado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);

    return res.status(500).json({
      success: false,
      error: "Erro ao enviar email",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
