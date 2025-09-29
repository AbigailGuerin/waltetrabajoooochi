<?php
// Requerimos el archivo modelos.php
require_once 'modelos.php';

// Si hay en parámetro tabla
if (isset($_GET['tabla'])) { // Si está seteado el parámetro tabla
    $tabla = new Modelo($_GET['tabla']); // Creamos el obejto tabla

    // Si hay parámetro id 
    if (isset($_GET['id'])) {
        $tabla->setCriterio ("id=" . $_GET['id']);
    }

    if (isset($_GET['accion']))  // Si está seteado el parámetro accion
        $accion = $_GET['accion']; // Guardamos el parámetro en una variable

        if ($accion === 'insertar' || $accion === 'actualizar') {
            $valores = $_POST; //Guardamoos los valores que viene desde el modelo
        }

        //Subida de imagenes
        if (                                               //Si
            isset($_FILES) &&                              //Esta seteado $_FILES
            isset($_FILES['imagen']) &&                    //existe el elemento 'imagen' y
            !empty($_FILES['imagen']['name'] &&             //NO esta vacio el nombre de la imagen y
                !empty($_FILES['imagen']['tmp_name']))        // NO esta vacio el nombre temporal


        ) {
            if (is_uploaded_file($_FILES['imagen']['tmp_name'])) {
                // Si esta subido el archivo temporal
                $nombre_temporal = $_FILES['imagen']['tmp_name'];
                $nombre = $_FILES['imagen']['name'];
                $destino = '../imagenes/productos/' . $nombre;

                if (move_uploaded_file($nombre_temporal, $destino)) {
                    // Si podemos mover el archivo temporal al destino
                    $mensaje = 'Archivo subido correctamente a ' . $destino;
                    $valores['imagen'] = $nombre;
                } else { // Sino 
                    $mensaje = 'No se ha podido subir el archivo';
                    unlink(ini_get('upload_tmp_dir') . $nombre_temporal); // Eliminamos el archivo temporal.



                }
            } else {
                $mensaje = 'Error: El archivo no fue procesado correctamente';
            }
        }

        // Verificamos la acción y ejecutamos según el caso
        switch ($accion) {
            case 'seleccionar':
                $datos = $tabla->seleccionar(); // Ejectutamos el método seleccionar
                echo $datos; // Mostramos los datos
                break;
             case 'insertar': // En caso que sea insertar 
                // Ejecutamos el metodo insertar y capturamos el id
                $pedido_id = $tabla-> insertar($valores);

                // Verificamos si se obtuvo un id valido
                if($pedido_id > 0) {
                    $response = [
                        'success'=> true,
                        'message'=> 'Pedido insertado correctamente.',
                        'pedido_id'=> $pedido_id
                    ];
                } else {
                    // En caso de que falle la insercion 
                    $response = [
                        'success'=> false,
                        'message'=> 'Error al insertar el pedido.'
                    ];
                }
                // Siempre enviamos la respuesta json al final
                echo json_encode($response);
                break;
                
            case 'insertar': // En caso que sea insertar
                $tabla->insertar($valores); // Ejecutamos el método insertar
                $mensaje = "Datos guardados"; // Escribimos un mensaje
                echo json_encode($mensaje); //Enviamos el mensaje en formato JSON
                break;

            case 'actualizar': // En caso de que sea actualizar
                $tabla->actualizar($valores); // Ejecutamos el método actualizar
                $mensaje = "Datos actualizados";
                echo json_encode($mensaje);
                break;

            case 'eliminar': // En caso de que sea eliminar
                $tabla->eliminar(); // Ejecutamos el método eliminar
                $mensaje = "Dato eliminado";
                echo json_encode($mensaje);
                break;
        }
    }

