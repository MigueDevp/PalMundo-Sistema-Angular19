import { Router } from 'express';
import pool from '../../config/database/dbconfig.js';

const router = Router();

// ===================
// GET all clients
// ===================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes ORDER BY nombre ASC'
    );

    res.json({
      success: true,
      data: result.rows,
      message: 'Clients retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving clients',
      error: error.message
    });
  }
});

// ===================
// GET client by ID
// ===================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM clientes WHERE id_cliente = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Client found'
    });
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving client',
      error: error.message
    });
  }
})


// POST new client
router.post('/', async (req, res) => {
  try {
    const { nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo, usuario_creacion } = req.body;

    // Validación mínima
    if (!nombre || !fecha_nacimiento || !direccion || !numero_telefono || !correo || !sexo || !usuario_creacion) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await pool.query(
  `INSERT INTO clientes 
    (nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo, fecha_creacion, usuario_creacion, activo)
   VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,true) RETURNING *`,
  [nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo, usuario_creacion]
);


    res.status(201).json({ success: true, data: result.rows[0], message: 'Client created successfully' });
  } catch (error) {
    console.error('Error creating client:', error);
    if (error.code === '23505') { // email duplicado
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Error creating client', error: error.message });
  }
});

// PUT update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo } = req.body;

    const result = await pool.query(
      `UPDATE clientes SET 
        nombre=$1, fecha_nacimiento=$2, direccion=$3, numero_telefono=$4, correo=$5, sexo=$6, fecha_modificacion=CURRENT_TIMESTAMP
       WHERE id_cliente=$7 RETURNING *`,
      [nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ success: false, message: 'Error updating client', error: error.message });
  }
});


// ===================
// DELETE client
// ===================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM clientes WHERE id_cliente = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
});

// ===================
// SEARCH clients
// ===================
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;

    const result = await pool.query(
      'SELECT * FROM clientes WHERE nombre ILIKE $1 ORDER BY nombre ASC',
      [`%${term}%`]
    );

    res.json({
      success: true,
      data: result.rows,
      message: `Found ${result.rows.length} clients`
    });
  } catch (error) {
    console.error('Error searching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching clients',
      error: error.message
    });
  }
});

export default router;
