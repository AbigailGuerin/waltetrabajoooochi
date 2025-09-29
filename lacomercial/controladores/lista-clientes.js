import {
  actualizarCliente,
  eliminarCliente,
  insertarClientes,
  seleccionarClientes,
} from "../modelos/clientes.js";

// Objetos del DOM
const listado = document.querySelector("#listado");
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(
  document.querySelector("#formularioModal")
);
const btnNuevo = document.querySelector("#btnNuevo");

// Inputs
const inputDireccion = document.querySelector("#direccion");
const inputNombre = document.querySelector("#nombre");
const inputApellido = document.querySelector("#apellido");
const inputEmail = document.querySelector("#email");
const inputTelefono = document.querySelector("#telefono");
const inputCuit = document.querySelector("#cuit");
const inputIva = document.querySelector("#iva");


// Variables
let buscar = "";
let opcion = "";
let id;
let mensajeAlerta;
let clientes = [];
let clientesFiltrados = [];
let cliente = {};

// Control de usuario
let usuario = "";
let usuario_id = "";
let logueado = false;

/**
 * Se ejecuta cuando se carga la página
 */
document.addEventListener("DOMContentLoaded", async () => {
  controlUsuario();
  clientes = await obtenerClientes();
  clientesFiltrados = filtrarPorNombre("");
  mostrarClientes();
});

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
  if (sessionStorage.getItem("usuario")) {
    usuario = sessionStorage.getItem("usuario");
    usuario_id = sessionStorage.getItem("usuario_id");
    logueado = true;
  } else {
    logueado = false;
  }
  if (logueado) {
    btnNuevo.style.display = "inline";
  } else {
    btnNuevo.style.display = "none";
  }
};

/**
 * Obtiene los clientes
 */
async function obtenerClientes() {
  clientes = await seleccionarClientes();
  return clientes;
}

/**
 * Filtra clientes por nombre
 * @param n nombre del cliente
 * @return clientes filtrados
 */
function filtrarPorNombre(n) {
  clientesFiltrados = clientes.filter((items) =>
    items.nombre.toLowerCase().includes(n.toLowerCase())
  );
  return clientesFiltrados;
}

/**
 * Muestra los clientes
 */
function mostrarClientes() {
  listado.innerHTML = "";
  clientesFiltrados.map(
    (cliente) =>
      (listado.innerHTML += `
        <div class="col">
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">
                ${cliente.nombre} ${cliente.apellido}
              </h5>
              <p class="card-text">
                <b>Dirección:</b> ${cliente.direccion}<br>
                <b>Email:</b> ${cliente.email}<br>
                <b>Teléfono:</b> ${cliente.telefono}<br>
                <b>Cuit:</b> ${cliente.cuit}<br>
                <b>Iva:</b> ${cliente.iva}<br>
              </p>
            </div>
            <div class="card-footer ${logueado ? "d-flex" : "d-none"}">
              <a class="btnEditar btn btn-primary">Editar</a>
              <a class="btnBorrar btn btn-danger">Borrar</a> 
              <input type="hidden" class="idCliente" value="${cliente.id}">                            
            </div>
          </div>
        </div>   
    `)
  );
}

/**
 * Ejecuta el clic del botón Nuevo
 */
btnNuevo.addEventListener("click", () => {
  // Limpiamos inputs
  inputDireccion.value = null;
  inputNombre.value = null;
  inputApellido.value = null;
  inputEmail.value = null;
  inputTelefono.value = null;
  inputCuit.value = null;
  inputIva.value = null;


  formularioModal.show();
  opcion = "insertar";
});

/**
 * Ejecuta el submit del formulario
 */
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const datos = new FormData(formulario);

  switch (opcion) {
    case "insertar":
      await insertarClientes(datos);
      mensajeAlerta = "¡Cliente agregado!";
      break;

    case "actualizar":
      await actualizarCliente(datos, id);
      mensajeAlerta = "¡Cliente actualizado!";
      break;
  }

  clientes = await obtenerClientes();
  clientesFiltrados = filtrarPorNombre(buscar);
  mostrarClientes();

  insertarAlerta(mensajeAlerta, "success");
});

/**
 * Define el mensaje de alerta
 */
const insertarAlerta = (mensaje, tipo) => {
  const envoltorio = document.createElement("div");
  envoltorio.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible" role="alert">
      <div>${mensaje}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
  alerta.append(envoltorio);
};

/**
 * Delegador de eventos
 */
const on = (elemento, evento, selector, manejador) => {
  elemento.addEventListener(evento, (e) => {
    if (e.target.closest(selector)) {
      manejador(e);
    }
  });
};

/**
 * Botón Editar
 */
on(document, "click", ".btnEditar", (e) => {
  const cardFooter = e.target.parentNode;
  id = cardFooter.querySelector(".idCliente").value;
  cliente = clientes.find((item) => item.id == id);

  inputDireccion.value = cliente.direccion;
  inputNombre.value = cliente.nombre;
  inputApellido.value = cliente.apellido;
  inputEmail.value = cliente.email;
  inputTelefono.value = cliente.telefono;
  inputCuit.value = cliente.cuit;
  inputIva.value = cliente.iva;

  formularioModal.show();
  opcion = "actualizar";
});

/**
 * Botón Borrar
 */
on(document, "click", ".btnBorrar", async (e) => {
  const cardFooter = e.target.parentNode;
  id = cardFooter.querySelector(".idCliente").value;
  cliente = clientes.find((item) => item.id == id);

  let aceptar = confirm(`¿Realmente desea eliminar a ${cliente.nombre}?`);
  if (aceptar) {
    await eliminarCliente(id);
    insertarAlerta(`${cliente.nombre} borrado!!`, "danger");

    clientes = await obtenerClientes();
    clientesFiltrados = filtrarPorNombre(buscar);
    mostrarClientes();
  }
});
