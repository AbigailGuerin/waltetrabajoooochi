// URL para acceder a la API
const URL = './api/datos.php?tabla=clientes';

/**
 * Selecciona los clientes de la BD
 */
export async function seleccionarClientes() {
    let res = await fetch(`${URL}&accion=seleccionar`);
    let datos = await res.json();
    if (res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    return datos;
}

/**
 * Inserta un cliente en la BD
 * @param datos los datos a insertar
 */
export const insertarClientes = (datos) => {
    return fetch(`${URL}&accion=insertar`, {
        method: 'POST',
        body: datos
    })
    .then(res => res.json())
    .then(data => {
        console.log("Cliente insertado:", data);
        return data;
    });
}

/**
 * Modifica un cliente en la BD
 * @param datos los datos a modificar
 * @param id el id del cliente a modificar
 */
export const actualizarCliente = (datos, id) => {
    return fetch(`${URL}&accion=actualizar&id=${id}`, {
        method: 'POST',
        body: datos
    })
    .then(res => res.json())
    .then(data => {
        console.log("Cliente actualizado:", data);
        return data;
    });
}

/**
 * Elimina un cliente en la BD
 * @param id el id del cliente a eliminar
 */
export const eliminarCliente = (id) => {
    return fetch(`${URL}&accion=eliminar&id=${id}`)
    .then(res => res.json())
    .then(data => {
        console.log("Cliente eliminado:", data);
        return data;
    });
}
