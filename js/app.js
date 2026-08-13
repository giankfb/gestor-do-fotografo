const state = {
  view: "dashboard",
  dashboard: null
};

const viewNames = {
  dashboard: ["Painel geral", "Veja os números do seu negócio."],
  clientes: ["Clientes", "Gerencie seus clientes e históricos."],
  orcamentos: ["Orçamentos", "Acompanhe suas negociações."],
  agenda: ["Agenda", "Organize sessões e eventos."],
  financeiro: ["Financeiro", "Controle entradas, saídas e saldo."],
  recebimentos: ["Recebimentos", "Acompanhe o que está para receber."],
  recibos: ["Recibos", "Consulte e emita recibos."],
  configuracoes: ["Configurações", "Configure os dados do sistema."]
};

document.addEventListener("DOMContentLoaded", () => {

  bindNavigation();

  loadDashboard();

});

function bindNavigation() {

  document.querySelectorAll("[data-view]").forEach(button => {

    button.addEventListener("click", () => {

      navigate(button.dataset.view);

    });

  });

  document.getElementById("mobileMenu")
    .addEventListener("click", () => {

      document.body.classList.toggle("menu-open");

    });

}

function navigate(view) {

  state.view = view;

  document.body.classList.remove("menu-open");

  document.querySelectorAll(".nav-item[data-view]")
    .forEach(item => {

      item.classList.toggle(
        "active",
        item.dataset.view === view
      );

    });

  document.querySelectorAll(".view")
    .forEach(section => {

      section.classList.remove("active-view");

    });

  const target =
    document.getElementById(
      `view-${view}`
    );

  if (target) {

    target.classList.add("active-view");

  } else {

    document
      .getElementById("view-placeholder")
      .classList.add("active-view");

    document
      .getElementById("placeholderTitle")
      .textContent =
      viewNames[view]?.[0] || "Módulo";

  }

  document.getElementById("pageTitle")
    .textContent =
    viewNames[view]?.[0];

  document.getElementById("pageSubtitle")
    .textContent =
    viewNames[view]?.[1];

}