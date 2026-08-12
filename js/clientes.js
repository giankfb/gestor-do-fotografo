const lista = document.getElementById(
    "listaClientes"
);

const modal = document.getElementById(
    "modalCliente"
);

const pesquisa = document.getElementById(
    "pesquisa"
);

let clientes = [];

async function carregarClientes() {

    const response =
        await fetch(
            `${API_URL}?action=clientes`
        );

    clientes = await response.json();

    renderizar(clientes);

}

function renderizar(listaClientes) {

    lista.innerHTML = "";

    listaClientes
        .filter(cliente =>
            cliente.status !== "inativo"
        )
        .forEach(cliente => {

            lista.innerHTML += `

            <div class="cliente-card">

                <h3>${cliente.nome}</h3>

                <p>${cliente.telefone}</p>

                <p>${cliente.email}</p>

                <button
                    onclick="inativar('${cliente.id}')"
                >

                    Inativar

                </button>

            </div>

            `;

        });

}

document
    .getElementById(
        "novoCliente"
    )
    .addEventListener(
        "click",
        () => {

            modal.style.display =
                "block";

        }
    );

document
    .getElementById(
        "cancelar"
    )
    .addEventListener(
        "click",
        () => {

            modal.style.display =
                "none";

        }
    );

document
    .getElementById(
        "salvar"
    )
    .addEventListener(
        "click",
        salvarCliente
    );

async function salvarCliente() {

    const cliente = {

        action:
            "cliente.salvar",

        nome:
            nome.value,

        telefone:
            telefone.value,

        whatsapp:
            whatsapp.value,

        email:
            email.value,

        instagram:
            instagram.value,

        cidade:
            cidade.value,

        estado:
            estado.value,

        origem:
            origem.value,

        tags:
            tags.value,

        observacoes:
            observacoes.value

    };

    await fetch(API_URL, {

        method: "POST",

        body:
            JSON.stringify(
                cliente
            )

    });

    modal.style.display =
        "none";

    carregarClientes();

}

async function inativar(id) {

    await fetch(API_URL, {

        method: "POST",

        body: JSON.stringify({

            action:
                "cliente.inativar",

            id

        })

    });

    carregarClientes();

}

pesquisa.addEventListener(
    "input",
    e => {

        const termo =
            e.target.value
                .toLowerCase();

        renderizar(

            clientes.filter(
                cliente =>

                cliente.nome
                    .toLowerCase()
                    .includes(
                        termo
                    )

            )

        );

    }
);

carregarClientes();