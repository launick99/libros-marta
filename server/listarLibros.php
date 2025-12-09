<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json");

    require 'conexion.php';

    $connection = Conexion::getConexion();
    $query = "SELECT * FROM libro";
    $PDOStatement = $connection->prepare($query);
    $PDOStatement->execute();
    $libros = $PDOStatement->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($libros);