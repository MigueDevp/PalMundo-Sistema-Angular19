import { Router } from 'express';
import pool from '../../config/database/dbconfig.js';

const router = Router();

// ===================
// GET all viajes
// ===================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM viajes ORDER BY nombre_viaje ASC');
    res.json({ success: true, data: result.rows, message: 'Viajes retrieved successfully' });
  } catch (error) {
    console.error('Error getting viajes:', error);
    res.status(500).json({ success: false, message: 'Error retrieving viajes', error: error.message });
  }
});

// ===================
// GET viaje by ID
// ===================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM viajes WHERE id_viaje = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Viaje not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Viaje found' });
  } catch (error) {
    console.error('Error getting viaje:', error);
    res.status(500).json({ success: false, message: 'Error retrieving viaje', error: error.message });
  }
});

// ===================
// POST new viaje
// ===================
router.post('/', async (req, res) => {
  try {
    const {
      clave,
      nombre_viaje,
      fecha_partida,
      fecha_regreso,
      ultimo_dia_pagar,
      precio_adulto,
      precio_menor,
      precio_infante,
      cantidad_anticipo,
      servicios_incluidos,
      servicios_no_incluidos,
      itinerario,
      estado_viaje,
      usuario_creacion
    } = req.body;

    if (!clave || !nombre_viaje || !fecha_partida || !fecha_regreso || !ultimo_dia_pagar || !precio_adulto || !precio_menor || !precio_infante || !cantidad_anticipo || !estado_viaje || !usuario_creacion) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const result = await pool.query(
      `INSERT INTO viajes 
      (clave, nombre_viaje, fecha_partida, fecha_regreso, ultimo_dia_pagar,
       precio_adulto, precio_menor, precio_infante, cantidad_anticipo, 
       servicios_incluidos, servicios_no_incluidos, itinerario, estado_viaje,
       fecha_creacion, usuario_creacion, activo)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP,$14,true)
      RETURNING *`,
      [
        clave, nombre_viaje, fecha_partida, fecha_regreso, ultimo_dia_pagar,
        precio_adulto, precio_menor, precio_infante, cantidad_anticipo,
        servicios_incluidos, servicios_no_incluidos, itinerario, estado_viaje,
        usuario_creacion
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Viaje created successfully' });
  } catch (error) {
    console.error('Error creating viaje:', error);
    res.status(500).json({ success: false, message: 'Error creating viaje', error: error.message });
  }
});

// ===================
// PUT update viaje
// ===================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clave,
      nombre_viaje,
      fecha_partida,
      fecha_regreso,
      ultimo_dia_pagar,
      precio_adulto,
      precio_menor,
      precio_infante,
      cantidad_anticipo,
      servicios_incluidos,
      servicios_no_incluidos,
      itinerario,
      estado_viaje
    } = req.body;

    const result = await pool.query(
      `UPDATE viajes SET
        clave=$1, nombre_viaje=$2, fecha_partida=$3, fecha_regreso=$4, ultimo_dia_pagar=$5,
        precio_adulto=$6, precio_menor=$7, precio_infante=$8, cantidad_anticipo=$9,
        servicios_incluidos=$10, servicios_no_incluidos=$11, itinerario=$12, estado_viaje=$13,
        fecha_modificacion=CURRENT_TIMESTAMP
       WHERE id_viaje=$14 RETURNING *`,
      [
        clave, nombre_viaje, fecha_partida, fecha_regreso, ultimo_dia_pagar,
        precio_adulto, precio_menor, precio_infante, cantidad_anticipo,
        servicios_incluidos, servicios_no_incluidos, itinerario, estado_viaje,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Viaje not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Viaje updated successfully' });
  } catch (error) {
    console.error('Error updating viaje:', error);
    res.status(500).json({ success: false, message: 'Error updating viaje', error: error.message });
  }
});

// ===================
// DELETE viaje
// ===================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM viajes WHERE id_viaje=$1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Viaje not found' });
    }

    res.json({ success: true, message: 'Viaje deleted successfully' });
  } catch (error) {
    console.error('Error deleting viaje:', error);
    res.status(500).json({ success: false, message: 'Error deleting viaje', error: error.message });
  }
});

// ===================
// SEARCH viajes by nombre
// ===================
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const result = await pool.query('SELECT * FROM viajes WHERE nombre_viaje ILIKE $1 ORDER BY nombre_viaje ASC', [`%${term}%`]);

    res.json({ success: true, data: result.rows, message: `Found ${result.rows.length} viajes` });
  } catch (error) {
    console.error('Error searching viajes:', error);
    res.status(500).json({ success: false, message: 'Error searching viajes', error: error.message });
  }
});

export default router;
