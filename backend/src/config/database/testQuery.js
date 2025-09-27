import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener ruta del archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..', '..'); 

// Cargar .env desde la raíz del proyecto
const envPath = join(rootDir, '.env');
console.log('🔍 Cargando .env desde:', envPath);
dotenv.config({ path: envPath });

// Configurar pool de conexiones
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

// Función para probar conexión
const testConnection = async () => {
  let client;
  try {
    console.log('🔄 Intentando conectar a PostgreSQL...');
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as fecha_actual, version()');
    
    console.log('✅ Conexión exitosa a PostgreSQL!');
    console.log('📅 Fecha del servidor:', result.rows[0].fecha_actual);
    console.log('🗄️  Versión:', result.rows[0].version.split(',')[0]);
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    // Sugerencias según el tipo de error
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Sugerencia: Verifica que PostgreSQL esté corriendo');
    } else if (error.code === '28P01') {
      console.log('💡 Sugerencia: Verifica usuario y contraseña');
    } else if (error.code === '3D000') {
      console.log('💡 Sugerencia: Verifica que la base de datos existe');
    }
    
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Función para ejecutar queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query ejecutado:', { 
      sql: text.substring(0, 50) + '...', 
      duration: duration + 'ms',
      rows: result.rowCount 
    });
    return result;
  } catch (error) {
    console.error('❌ Error en query:', error.message);
    throw error;
  }
};

// Función de prueba completa
async function pruebaCompleta() {
  console.log('🚀 INICIANDO PRUEBA DE CONEXIÓN A POSTGRESQL\n');
  
  // Debug de variables de entorno
  console.log('🔧 Configuración cargada:');
  console.log('   DB_HOST:', process.env.DB_HOST || 'localhost');
  console.log('   DB_PORT:', process.env.DB_PORT || '5432');
  console.log('   DB_NAME:', process.env.DB_NAME || 'pal_mundo');
  console.log('   DB_USER:', process.env.DB_USER || 'postgres');
  console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-2) : 'No definido');
  console.log('');
  
  // 1. Probar conexión básica
  const conexionOk = await testConnection();
  
  if (!conexionOk) {
    console.log('❌ No se pudo conectar. Revisa tu configuración.');
    await pool.end();
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🔍 PROBANDO CONSULTAS A TUS TABLAS');
  console.log('='.repeat(50));
  
  try {
    // 2. Probar que existan las tablas principales
    console.log('\n📋 Verificando tablas...');
    
    const tablasResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('✅ Tablas encontradas:');
    if (tablasResult.rows.length === 0) {
      console.log('   ⚠️  No se encontraron tablas');
      console.log('   💡 ¿Has ejecutado los scripts CREATE TABLE?');
    } else {
      tablasResult.rows.forEach(row => {
        console.log('   📄', row.table_name);
      });
    }
    
    // 3. Contar registros en clientes
    console.log('\n👥 Contando clientes...');
    try {
      const clientesCount = await query('SELECT COUNT(*) as total FROM clientes WHERE activo = TRUE');
      console.log(`   Total de clientes activos: ${clientesCount.rows[0].total}`);
      
      // 5. Mostrar algunos clientes de ejemplo
      if (parseInt(clientesCount.rows[0].total) > 0) {
        console.log('\n👤 Primeros 3 clientes:');
        const clientesEjemplo = await query('SELECT nombre, correo FROM clientes WHERE activo = TRUE LIMIT 3');
        clientesEjemplo.rows.forEach((cliente, index) => {
          console.log(`   ${index + 1}. ${cliente.nombre} - ${cliente.correo || 'Sin email'}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Error consultando clientes: ${error.message}`);
    }
    
    // 4. Contar registros en viajes
    console.log('\n✈️  Contando viajes...');
    try {
      const viajesCount = await query('SELECT COUNT(*) as total FROM viajes WHERE activo = TRUE');
      console.log(`   Total de viajes activos: ${viajesCount.rows[0].total}`);
      
      // Mostrar algunos viajes si existen
      if (parseInt(viajesCount.rows[0].total) > 0) {
        console.log('\n🌍 Primeros 2 viajes:');
        const viajesEjemplo = await query('SELECT nombre_viaje, fecha_partida FROM viajes WHERE activo = TRUE LIMIT 2');
        viajesEjemplo.rows.forEach((viaje, index) => {
          console.log(`   ${index + 1}. ${viaje.nombre_viaje} - ${viaje.fecha_partida?.toDateString() || 'Sin fecha'}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Error consultando viajes: ${error.message}`);
    }
    
    // 6. Contar contratos si existe la tabla
    console.log('\n📋 Contando contratos...');
    try {
      const contratosCount = await query('SELECT COUNT(*) as total FROM contratos WHERE activo = TRUE');
      console.log(`   Total de contratos activos: ${contratosCount.rows[0].total}`);
    } catch (error) {
      console.log(`   ❌ Error consultando contratos: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ¡CONEXIÓN Y CONSULTAS EXITOSAS!');
    console.log('✅ Tu base de datos está lista para el backend');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Error en las consultas:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('💡 Parece que falta alguna tabla. ¿Ejecutaste todos los CREATE TABLE?');
    }
  }
  
  // Cerrar todas las conexiones del pool
  await pool.end();
  console.log('🔌 Pool de conexiones cerrado');
  process.exit(0);
}

// Ejecutar la prueba
pruebaCompleta().catch(error => {
  console.error('💥 Error fatal:', error.message);
  process.exit(1);
});