import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const routes = express.Router();

routes.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

routes.get('/agregar', (req, res) => {
  const { nombre, precio } = req.query;
  const objectDeporte = { nombre, precio };

  // Lee el archivo data.json, si no existe crea uno nuevo con un array vacío
  let deportes = [];
  try {
    const deporteJSON = fs.readFileSync(__dirname + '/data/data.json');
    deportes = JSON.parse(deporteJSON).deportes;
  } catch (error) {
    // Si el archivo no existe, crea uno nuevo
    deportes = []; 
  }

  // Agrega el nuevo deporte
  deportes.push(objectDeporte);

  // Escribe los deportes en el archivo
  fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify({ deportes }));
  res.send('deporte agregado');
});

routes.get('/deportes', (req, res) => {
  res.sendFile(__dirname + '/data/data.json');
});

routes.get('/editar', (req, res) => {
  const { nombre, precio } = req.query;
  try {
    const deporteJSON = fs.readFileSync(__dirname + '/data/data.json');
    const { deportes } = JSON.parse(deporteJSON);
    const index = deportes.findIndex((d) => d.nombre === nombre);
    if (index !== -1) {
      deportes[index].precio = precio;
      fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify({ deportes }));
      res.send('deporte editado');
    } else {
      res.status(404).send('Deporte no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al editar el deporte');
  }
});

routes.get('/eliminar', (req, res) => {
  const { nombre } = req.query;

  // Lee el archivo data.json, si no existe crea uno nuevo con un array vacío
  let deportes = [];
  try {
    const deporteJSON = fs.readFileSync(__dirname + '/data/data.json');
    deportes = JSON.parse(deporteJSON).deportes;
  } catch (error) {
    // Si el archivo no existe, crea uno nuevo
    deportes = []; 
  }

  // Elimina el deporte
  const index = deportes.findIndex((d) => d.nombre === nombre);
  if (index !== -1) {
    deportes.splice(index, 1);

    // Escribe los deportes en el archivo
    fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify({ deportes }));
    res.send('deporte eliminado');
  } else {
    res.status(404).send('Deporte no encontrado');
  }
});

export default routes;