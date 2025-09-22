<?php 
// Requerimos la clase Modelo
require_once 'modelos.php';

// Guardamos en $valores los datos del formulario 
$valores = $_POST;

//creamos las variables $usuario y $ password
$usuario = "'".$valores['usuario']."'";
$password = "'".$valores['password']."'";

// Creamos el objeto usuarios de la tabla clientes
$usuarios = new Modelo('clientes');

// Establecemos el criterio con el usuario y el password
$usuarios->setCriterio("usuario=$usuario AND password=$password");

// Seleccionamos los datos
$datos = $usuarios->seleccionar();

// Devolvemos los datos
echo $datos;
?>