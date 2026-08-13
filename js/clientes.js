let clientes = [];

document.addEventListener(
  "DOMContentLoaded",
  carregarClientes
);

async function carregarClientes() {

  try {

    const dados =
      await API.get("clientes");

    clientes = dados || [];

    renderizarClientes();

  }

  catch (erro) {

    console.error(erro);

  }

}

function renderizarClientes(lista = clientes) {

  const container =
    document.getElementById(
      "listaClientes"
    );

  if (!container) {

    return;

  }

  container.innerHTML = "";

  const ativos =
    lista.filter(
      cliente =>
        cliente.status !== "inativo"
    );

  if (!ativos.length) {

    container.innerHTML =

      "<p>Nenhum cliente cadastrado.</p>";

    return;

  }

  ativos.forEach(cliente => {

    container.innerHTML += `

      <div class="cliente-card">

        <h3>${cliente.nome}</h3>

        <p>${cliente.telefone || ""}</p>

        <p>${cliente.email || ""}</p>

        <button onclick="inativarCliente('${cliente.id}')">

          Inativar

        </button>

      </div>

    `;

  });

}

async function inativarCliente(id) {

  await API.post(
    "cliente.inativar",
    { id }
  );

  await carregarClientes();

}

document.addEventListener(
  "input",
  e => {

    if (
      e.target.id !==
      "pesquisaCliente"
    ) {

      return;

    }

    const termo =
      e.target.value
        .toLowerCase();

    const filtrados =
      clientes.filter(cliente =>
        cliente.nome
          .toLowerCase()
          .includes(termo)
      );

    renderizarClientes(
      filtrados
    );

  }
);