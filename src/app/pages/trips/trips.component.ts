import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';

@Component({
  selector: 'app-trips',
  imports: [CommonModule, FormsModule, ButtonAddComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent {
  activeTab: 'general' | 'precios' | 'detalles' = 'general';
  incluyeTemporal: string = '';
  noIncluyeTemporal: string = '';
  puntosSalidaTemporal: string = '';

  selectedViaje: any = null;
  showDetailModal = false;

  openDetailModal(viaje: any) {
    this.selectedViaje = viaje;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedViaje = null;
  }

  viajes = signal([
    {
      id: 1,
      clave: 'QRO-MAZ-0325',
      nombre: 'Mazatlán Premium: Todo Incluido',
      fechaPartida: '2025-03-15T08:00',
      fechaRegreso: '2025-03-22T20:00',
      ultimoDiaPago: '2025-02-28',
      anticipo: 2500,
      precioAdulto: 6500,
      precioInfante: 500,
      precioMenor: 3500,
      incluye: [
        'Autobús viaje redondo',
        'Hospedaje 4* en zona dorada',
        'Coordinador de viaje',
        'Seguro médico básico',
        'Desayunos buffet',
      ],
      noIncluye: [
        'Comidas no especificadas',
        'Actividades opcionales',
        'Propinas',
        'Entradas a atracciones',
      ],
      itinerario: [
        {
          dia: 1,
          titulo: 'Llegada a Mazatlán',
          descripcion:
            'Recepción en el hotel y tarde libre para disfrutar de la playa. Reunión informativa a las 18:00 hrs.',
        },
        {
          dia: 2,
          titulo: 'Tour centro histórico',
          descripcion:
            'Visita al teatro Ángela Peralta, catedral y mercado municipal. Tarde libre en playa Bruja.',
        },
      ],
      informacionAdicional: {
        puntosSalida: [
          'Querétaro - Plaza de las Américas 05:00 hrs',
          'San Juan del Río - Casino 06:00 hrs',
        ],
        formasPago: [
          'Efectivo en sucursal',
          'Transferencia bancaria',
          'Tarjeta de crédito (hasta 12 MSI)',
        ],
        politicas:
          'Cancelación con 15 días de anticipación para reembolso del 80%',
      },
    },
    {
      id: 2,
      clave: 'QRO-CUN-0425',
      nombre: 'Cancún Caribe Aventura',
      fechaPartida: '2025-04-10T06:00',
      fechaRegreso: '2025-04-17T22:00',
      ultimoDiaPago: '2025-03-20',
      anticipo: 3000,
      precioAdulto: 8500,
      precioInfante: 800,
      precioMenor: 4500,
      incluye: [
        'Vuelo redondo (clase turista)',
        'Hospedaje 5* todo incluido',
        'Transporte aeropuerto-hotel',
        'Seguro de viaje',
        'Tour a Isla Mujeres',
      ],
      noIncluye: [
        'Bebidas premium',
        'Excursiones extras',
        'Propinas',
        'Impuesto aeroportuario',
      ],
      itinerario: [
        {
          dia: 1,
          titulo: 'Llegada a Cancún',
          descripcion:
            'Traslado al hotel. Tarde libre para disfrutar de las instalaciones.',
        },
        {
          dia: 2,
          titulo: 'Isla Mujeres',
          descripcion: 'Tour completo por la isla con snorkel incluido.',
        },
      ],
      informacionAdicional: {
        puntosSalida: ['Aeropuerto de Querétaro 04:00 hrs'],
        formasPago: ['Tarjeta de crédito (6 MSI)', 'Transferencia bancaria'],
        politicas:
          'Se requiere pasaporte vigente. Cancelación con 30 días de anticipación.',
      },
    },
    {
      id: 3,
      clave: 'QRO-PV-0525',
      nombre: 'Puerto Vallarta Romántico',
      fechaPartida: '2025-05-20T07:30',
      fechaRegreso: '2025-05-27T21:30',
      ultimoDiaPago: '2025-04-30',
      anticipo: 2800,
      precioAdulto: 7200,
      precioInfante: 600,
      precioMenor: 3800,
      incluye: [
        'Autobús ejecutivo',
        'Hospedaje 4* frente al mar',
        'Cena romántica incluida',
        'Tour por el malecón',
        'Seguro de viaje',
      ],
      noIncluye: ['Actividades acuáticas', 'Propinas', 'Gastos personales'],
      itinerario: [
        {
          dia: 1,
          titulo: 'Viaje a Vallarta',
          descripcion: 'Salida desde Querétaro con paradas programadas.',
        },
        {
          dia: 2,
          titulo: 'Tour gastronómico',
          descripcion: 'Recorrido por los mejores restaurantes de la zona.',
        },
      ],
      informacionAdicional: {
        puntosSalida: [
          'Querétaro - Terminal Alameda 06:00 hrs',
          'Celaya - Plaza Mayor 07:30 hrs',
        ],
        formasPago: ['Efectivo (10% descuento)', 'Tarjeta de crédito/débito'],
        politicas:
          'Habitación doble obligatoria. Cambios con 20 días de anticipación.',
      },
    },
    {
      id: 4,
      clave: 'QRO-LC-0625',
      nombre: 'Los Cabos VIP',
      fechaPartida: '2025-06-15T05:00',
      fechaRegreso: '2025-06-22T23:00',
      ultimoDiaPago: '2025-05-25',
      anticipo: 3500,
      precioAdulto: 9200,
      precioInfante: 900,
      precioMenor: 5500,
      incluye: [
        'Vuelo directo',
        'Hospedaje 5* con vista al mar',
        'Tour al Arco',
        'Cena en restaurante gourmet',
        'Transporte privado',
      ],
      noIncluye: ['Bebidas alcohólicas', 'Spa', 'Propinas'],
      itinerario: [
        {
          dia: 1,
          titulo: 'Llegada a Los Cabos',
          descripcion: 'Check-in en hotel y tarde libre.',
        },
        {
          dia: 2,
          titulo: 'Excursión al Arco',
          descripcion: 'Paseo en yate con avistamiento de fauna marina.',
        },
      ],
      informacionAdicional: {
        puntosSalida: ['Aeropuerto de Querétaro 03:00 hrs'],
        formasPago: ['Tarjeta de crédito (hasta 18 MSI)', 'Depósito bancario'],
        politicas:
          'Requisito: Vacunación completa. Política de cancelación estricta.',
      },
    },
    {
      id: 5,
      clave: 'QRO-GDL-0725',
      nombre: 'Tour Guadalajara y Tequila',
      fechaPartida: '2025-07-05T08:00',
      fechaRegreso: '2025-07-07T22:00',
      ultimoDiaPago: '2025-06-15',
      anticipo: 1500,
      precioAdulto: 3800,
      precioInfante: 300,
      precioMenor: 2200,
      incluye: [
        'Transporte redondo',
        'Hospedaje 3* centro histórico',
        'Tour a fábrica de tequila',
        'Visita a Tlaquepaque',
        'Seguro básico',
      ],
      noIncluye: ['Comidas', 'Entradas a museos', 'Gastos personales'],
      itinerario: [
        {
          dia: 1,
          titulo: 'Llegada a GDL',
          descripcion: 'Recorrido por el centro histórico y hospedaje.',
        },
        {
          dia: 2,
          titulo: 'Ruta del Tequila',
          descripcion: 'Visita a destilerías tradicionales con degustación.',
        },
      ],
      informacionAdicional: {
        puntosSalida: ['Querétaro - Plaza Constitución 07:00 hrs'],
        formasPago: ['Efectivo', 'Transferencia'],
        politicas: 'Edad mínima para degustación: 18 años. No reembolsable.',
      },
    },
    {
      id: 6,
      clave: 'QRO-SM-0825',
      nombre: 'San Miguel Allende Cultural',
      fechaPartida: '2025-08-12T09:00',
      fechaRegreso: '2025-08-14T20:00',
      ultimoDiaPago: '2025-07-22',
      anticipo: 1200,
      precioAdulto: 2800,
      precioInfante: 200,
      precioMenor: 1800,
      incluye: [
        'Transporte ejecutivo',
        'Hospedaje boutique',
        'Tour guiado por la ciudad',
        'Entrada al jardín botánico',
        'Degustación gastronómica',
      ],
      noIncluye: ['Completas', 'Compras personales', 'Propinas'],
      itinerario: [
        {
          dia: 1,
          titulo: 'Arquitectura colonial',
          descripcion:
            'Recorrido por los edificios históricos más importantes.',
        },
        {
          dia: 2,
          titulo: 'Arte y artesanías',
          descripcion:
            'Visita a talleres de artistas locales y mercado de artesanías.',
        },
      ],
      informacionAdicional: {
        puntosSalida: ['Querétaro - Estación Terminal 08:00 hrs'],
        formasPago: ['Efectivo (5% descuento)', 'Tarjeta'],
        politicas:
          'Recomendado para adultos mayores. Cancelación con 10 días de anticipación.',
      },
    },
  ]);

  showModal = false;
  newViaje = {
    clave: '',
    nombre: '',
    fechaPartida: '',
    fechaRegreso: '',
    ultimoDiaPago: '',
    anticipo: 0,
    precioAdulto: 0,
    precioInfante: 0,
    precioMenor: 0,
    incluye: [''],
    noIncluye: [''],
    itinerario: [{ dia: 1, titulo: '', descripcion: '' }],
    informacionAdicional: {
      puntosSalida: [''],
      formasPago: [''],
      politicas: '',
    },
  };

  openAddModal() {
    this.showModal = true;
    this.activeTab = 'general';
    this.incluyeTemporal = '';
    this.noIncluyeTemporal = '';
    this.puntosSalidaTemporal = '';
  }

  closeModal() {
    this.showModal = false;
  }

  nextTab() {
    if (this.activeTab === 'general') {
      this.activeTab = 'precios';
    } else if (this.activeTab === 'precios') {
      this.activeTab = 'detalles';
    }
  }

  addViaje() {
    if (this.newViaje.clave && this.newViaje.nombre) {
      // Procesar los campos de texto a arrays
      this.newViaje.incluye = this.incluyeTemporal
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);
      this.newViaje.noIncluye = this.noIncluyeTemporal
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);
      this.newViaje.informacionAdicional.puntosSalida =
        this.puntosSalidaTemporal
          .split('\n')
          .map((item) => item.trim())
          .filter((item) => item);

      this.viajes.update((list) => [
        ...list,
        {
          id: this.viajes().length + 1,
          ...this.newViaje,
          itinerario: this.newViaje.itinerario.filter(
            (item) => item.titulo || item.descripcion
          ),
          informacionAdicional: {
            ...this.newViaje.informacionAdicional,
            formasPago: this.newViaje.informacionAdicional.formasPago.filter(
              (item) => item
            ),
            politicas:
              this.newViaje.informacionAdicional.politicas ||
              'Políticas básicas del viaje',
          },
        },
      ]);
      this.closeModal();
    }
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX');
  }

  formatFechaHora(fechaHora: string): string {
    if (!fechaHora) return '';
    const date = new Date(fechaHora);
    return date.toLocaleString('es-MX');
  }
}
