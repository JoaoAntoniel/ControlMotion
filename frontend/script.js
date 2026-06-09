// =============================
// SMOOTH SCROLL (com offset navbar)
// =============================
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = document.querySelector("nav").offsetHeight;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - navHeight;

    window.scrollTo({
      top: top,
      behavior: "smooth",
    });

    // fecha menu mobile
    document.getElementById("mobileMenu").classList.remove("active");
    document.getElementById("hamburger").classList.remove("active");
  });
});

// =============================
// MENU HAMBURGER
// =============================
document.getElementById("hamburger").addEventListener("click", function () {
  this.classList.toggle("active");
  document.getElementById("mobileMenu").classList.toggle("active");
});

// =============================
// ANO AUTOMÁTICO FOOTER
// =============================
document.getElementById("year").textContent = new Date().getFullYear();

// =============================
// MODAL
// =============================
const modal = document.getElementById("contactModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close-modal");
const form = document.getElementById("contact-form");

// abrir modal
openBtn.onclick = () => {
  modal.classList.add("show");
};

// função única para fechar modal
function closeModal() {
  modal.classList.remove("show");
  form.reset();
}

// botão fechar
closeBtn.onclick = closeModal;

// clicar fora
window.onclick = (e) => {
  if (e.target === modal) {
    closeModal();
  }
};

// =============================
// TOAST (notificação bonita)
// =============================
const toast = document.getElementById("toast");

function showToast() {
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// =============================
// ENVIO DE EMAIL
// =============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    company: document.getElementById("company").value,
    message: document.getElementById("message").value,
  };

  try {
    const response = await fetch("http://localhost:3000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showToast(); // mostra mensagem bonita
      closeModal(); // fecha modal + limpa form
    } else {
      console.error("Erro ao enviar email", result);
    }
  } catch (error) {
    console.error(error);
  }
});
// =============================
// MÁSCARA DE TELEFONE
// =============================
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function (e) {
  // 1. Remove tudo que não for número (inclusive o +)
  let value = e.target.value.replace(/\D/g, "");

  // 2. Se o autocompletar colar o 55 do Brasil, nós removemos
  if (value.startsWith("55") && value.length > 11) {
    value = value.substring(2);
  }

  // 3. Trava o limite em 11 números puros (2 do DDD + 9 do telefone)
  value = value.substring(0, 11);

  // 4. Aplica a formatação final: (XX) XXXXX-XXXX
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");

  e.target.value = value;
});
