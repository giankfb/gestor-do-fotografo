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
    button.addEventListener("click", () => navigate(button.dataset.view));
  });

  document.getElementById("mobileMenu").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
}

function navigate(view) {
  state.view = view;
  document.body.classList.remove("menu-open");

  document.querySelectorAll(".nav-item[data-view]").forEach(item => {
    item.classList.toggle("active", item.dataset.view === view);
  });

  const dashboard = document.getElementById("view-dashboard");
  const placeholder = document.getElementById("view-placeholder");

  if (view === "dashboard") {
    dashboard.classList.add("active-view");
    placeholder.classList.remove("active-view");
  } else {
    dashboard.classList.remove("active-view");
    placeholder.classList.add("active-view");
    document.getElementById("placeholderTitle").textContent = viewNames[view]?.[0] || "Módulo";
  }

  document.getElementById("pageTitle").textContent = viewNames[view]?.[0] || "Gestor do Fotógrafo";
  document.getElementById("pageSubtitle").textContent = viewNames[view]?.[1] || "";
}

async function loadDashboard() {
  try {
    const data = await API.get("dashboard");
    if (!data) return;
    state.dashboard = data;
    renderDashboard(data);
  } catch (error) {
    console.error("Falha ao carregar dashboard:", error);
  }
}

function renderDashboard(data) {
  document.getElementById("statFaturamento").textContent = money(data.faturamento);
  document.getElementById("statClientes").textContent = data.clientes ?? 0;
  document.getElementById("statOrcamentos").textContent = data.orcamentos ?? 0;
  document.getElementById("statAgenda").textContent = data.agenda ?? 0;
  document.getElementById("statReceber").textContent = money(data.aReceber);
  document.getElementById("statRecibos").textContent = data.recibos ?? 0;
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value || 0));
}
