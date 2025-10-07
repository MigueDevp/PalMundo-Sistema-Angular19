import { Router } from "express";
import pool from "../../config/database/dbconfig.js";

const router = Router();

// ===================
// GET all clients
// ===================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clientes ORDER BY nombre ASC"
    );

    res.json({
      success: true,
      data: result.rows,
      message: "Clients retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting clients:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving clients",
      error: error.message,
    });
  }
});

// ===================
// GET client by ID
// ===================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Client found",
    });
  } catch (error) {
    console.error("Error getting client:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving client",
      error: error.message,
    });
  }
});

// POST new client - VERSIÓN CORREGIDA
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      fecha_nacimiento,
      direccion,
      numero_telefono,
      correo,
      sexo,
      usuario_creacion,
      activo,
    } = req.body;

    console.log("📥 Datos recibidos:", req.body); // DEBUG

    // Validación mejorada
    if (
      !nombre ||
      !fecha_nacimiento ||
      !direccion ||
      !numero_telefono ||
      !sexo ||
      !usuario_creacion
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Nombre, fecha_nacimiento, direccion, numero_telefono, sexo y usuario_creacion son obligatorios",
      });
    }

    const result = await pool.query(
      `INSERT INTO clientes 
        (nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo, fecha_creacion, usuario_creacion, activo)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8) RETURNING *`,
      [
        nombre.toString().trim(),
        fecha_nacimiento,
        direccion.toString().trim(),
        numero_telefono.toString().trim(),
        correo ? correo.toString().trim() : "",
        sexo.toString().trim(),
        usuario_creacion.toString().trim(),
        activo !== false,
      ]
    );

    console.log("✅ Cliente insertado:", result.rows[0]); // DEBUG

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Cliente creado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error en POST /api/clients:", error);
    console.error("📋 Detalle del error:", {
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint,
    });

    // Manejo específico de errores de PostgreSQL
    if (error.code === "23505") {
      // Violación de unique constraint
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya existe en el sistema",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear cliente",
      error: error.message,
    });
  }
});

// PUT update client
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fecha_nacimiento,
      direccion,
      numero_telefono,
      correo,
      sexo,
    } = req.body;

    const result = await pool.query(
      `UPDATE clientes SET 
        nombre=$1, fecha_nacimiento=$2, direccion=$3, numero_telefono=$4, correo=$5, sexo=$6, fecha_modificacion=CURRENT_TIMESTAMP
       WHERE id_cliente=$7 RETURNING *`,
      [nombre, fecha_nacimiento, direccion, numero_telefono, correo, sexo, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Client updated successfully",
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating client",
        error: error.message,
      });
  }
});

// ===================
// DELETE client
// ===================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: error.message,
    });
  }
});

// ===================
// SEARCH clients
// ===================
router.get("/search/:term", async (req, res) => {
  try {
    const { term } = req.params;

    const result = await pool.query(
      "SELECT * FROM clientes WHERE nombre ILIKE $1 ORDER BY nombre ASC",
      [`%${term}%`]
    );

    res.json({
      success: true,
      data: result.rows,
      message: `Found ${result.rows.length} clients`,
    });
  } catch (error) {
    console.error("Error searching clients:", error);
    res.status(500).json({
      success: false,
      message: "Error searching clients",
      error: error.message,
    });
  }
});

export default router;
