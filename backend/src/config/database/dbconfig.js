// src/config/database/dbconfig.js - VERSIÓN DEBUG
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener el directorio actual y subir hasta la raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..', '..'); // Subir 3 niveles hasta backend/

// Cargar .env desde la raíz del proyecto
const envPath = join(rootDir, '.env');
console.log('🔍 Buscando archivo .env en:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log('⚠️  No se encontró archivo .env, usando valores por defecto');
} else {
  console.log('✅ Archivo .env cargado correctamente');
}

// Debug: Mostrar las variables de entorno (sin mostrar password completo)
console.log('🔧 Variables de entorno cargadas:');
console.log('   DB_HOST:', process.env.DB_HOST || 'No definido');
console.log('   DB_PORT:', process.env.DB_PORT || 'No definido');
console.log('   DB_NAME:', process.env.DB_NAME || 'No definido');
console.log('   DB_USER:', process.env.DB_USER || 'No definido');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-2) : 'No definido');

// Configurar el pool de conexiones
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pal_mundo',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT) || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Función para probar la conexión
const testConnection = async () => {
  let client;
  try {
    console.log('\n🔄 Intentando conectar a PostgreSQL...');
    console.log('📡 Conectando a:', `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'pal_mundo'}`);
    
    // Obtener una conexión del pool
    client = await pool.connect();
    
    // Hacer una consulta simple para probar
    const result = await client.query('SELECT NOW() as fecha_actual, version()');
    
    console.log('✅ ¡CONEXIÓN EXITOSA A POSTGRESQL!');
    console.log('📅 Fecha del servidor:', result.rows[0].fecha_actual);
    console.log('🗄️  Versión:', result.rows[0].version.split(',')[0]);
    
    return { success: true, client };
  } catch (error) {
    console.error('\n❌ ERROR CONECTANDO A POSTGRESQL:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    // Sugerencias según el tipo de error
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Sugerencia: PostgreSQL no está corriendo o puerto incorrecto');
      console.log('   - Inicia PostgreSQL');
      console.log('   - Verifica el puerto (normalmente 5432)');
    } else if (error.code === '28P01') {
      console.log('💡 Sugerencia: Usuario o contraseña incorrectos');
      console.log('   - Verifica DB_USER y DB_PASSWORD en .env');
    } else if (error.code === '3D000') {
      console.log('💡 Sugerencia: La base de datos no existe');
      console.log('   - Crea la base de datos "pal_mundo" en PostgreSQL');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Sugerencia: Host incorrecto');
      console.log('   - Verifica DB_HOST en .env');
    }
    
    return { success: false, error };
  } finally {
    // Liberar la conexión de vuelta al pool
    if (client) {
      client.release();
    }
  }
};

// Función de prueba completa
async function pruebaCompleta() {
  console.log('🚀 INICIANDO PRUEBA DE CONEXIÓN A POSTGRESQL');
  console.log('='.repeat(60));
  
  // 1. Probar conexión básica
  const conexionResult = await testConnection();
  
  if (!conexionResult.success) {
    console.log('\n❌ No se pudo conectar. Revisa tu configuración.');
    console.log('🔧 Pasos para solucionar:');
    console.log('   1. Verifica que PostgreSQL esté corriendo');
    console.log('   2. Verifica los datos en el archivo .env');
    console.log('   3. Asegúrate que la base de datos "pal_mundo" existe');
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔍 PROBANDO CONSULTAS A TUS TABLAS');
  console.log('='.repeat(60));
  
  try {
    // 2. Probar que existan las tablas principales
    console.log('\n📋 Verificando tablas en la base de datos...');
    
    const tablasResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    if (tablasResult.rows.length === 0) {
      console.log('⚠️  No se encontraron tablas en la base de datos');
      console.log('💡 ¿Has ejecutado los scripts CREATE TABLE?');
    } else {
      console.log('✅ Tablas encontradas:');
      tablasResult.rows.forEach(row => {
        console.log('   📄', row.table_name);
      });
    }
    
    // 3. Si hay tablas, probar algunas consultas
    const tablasEsperadas = ['clientes', 'viajes', 'contratos'];
    for (const tabla of tablasEsperadas) {
      try {
        const count = await pool.query(`SELECT COUNT(*) as total FROM ${tabla} WHERE activo = TRUE`);
        console.log(`✅ ${tabla}: ${count.rows[0].total} registros activos`);
      } catch (err) {
        console.log(`❌ ${tabla}: No existe o error - ${err.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ¡PRUEBA COMPLETADA!');
    console.log('✅ La conexión a PostgreSQL funciona correctamente');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error en las consultas:', error.message);
  }
  
  // Cerrar todas las conexiones
 //await pool.end();
 // console.log('🔌 Conexiones cerradas');
}

// Ejecutar la prueba automáticamente
pruebaCompleta().catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});

export default pool;