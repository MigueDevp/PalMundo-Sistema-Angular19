import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faPlane,
  faCalendarAlt,
  faDollarSign,
  faSearch,
  faFilter,
  faClock,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trip-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './trip-catalog.component.html',
  styleUrls: ['./trip-catalog.component.css']
})
export class TripCatalogComponent {
  searchTerm: string = '';
  priceFilter: string = '';
  
  // Icons
  faPlane = faPlane;
  faCalendarAlt = faCalendarAlt;
  faDollarSign = faDollarSign;
  faSearch = faSearch;
  faFilter = faFilter;
  faClock = faClock;
  faMapMarkerAlt = faMapMarkerAlt;
  
  // Usamos los mismos datos que en tu lista de viajes
  viajes = [
  {
    id: 1,
    clave: 'QRO-MAZ-0325',
    nombre: 'Mazatlán Premium: Todo Incluido',
    fechaPartida: '2025-03-15T08:00:00',
    fechaRegreso: '2025-03-22T20:00:00',
    ultimoDiaPago: '2025-02-28',
    anticipo: 4500
  },
  {
    id: 2,
    clave: 'CDMX-CUN-0425',
    nombre: 'Cancún Caribe Adventure',
    fechaPartida: '2025-04-10T06:00:00',
    fechaRegreso: '2025-04-17T22:00:00',
    ultimoDiaPago: '2025-03-20',
    anticipo: 6200
  },
  {
    id: 3,
    clave: 'GDL-PVR-0525',
    nombre: 'Puerto Vallarta Luxury',
    fechaPartida: '2025-05-05T10:00:00',
    fechaRegreso: '2025-05-12T18:00:00',
    ultimoDiaPago: '2025-04-15',
    anticipo: 7800
  },
  {
    id: 4,
    clave: 'MTY-SJD-0625',
    nombre: 'Los Cabos VIP Experience',
    fechaPartida: '2025-06-12T07:00:00',
    fechaRegreso: '2025-06-19T21:00:00',
    ultimoDiaPago: '2025-05-22',
    anticipo: 8500
  },
  {
    id: 5,
    clave: 'QRO-HUX-0725',
    nombre: 'Huatulco Eco Tour',
    fechaPartida: '2025-07-08T09:00:00',
    fechaRegreso: '2025-07-15T19:00:00',
    ultimoDiaPago: '2025-06-18',
    anticipo: 3800
  },
  {
    id: 6,
    clave: 'CDMX-ACA-0825',
    nombre: 'Acapulco Diamante',
    fechaPartida: '2025-08-14T06:30:00',
    fechaRegreso: '2025-08-21T20:30:00',
    ultimoDiaPago: '2025-07-24',
    anticipo: 5400
  },
  {
    id: 7,
    clave: 'GDL-ZIH-0925',
    nombre: 'Ixtapa-Zihuatanejo Relax',
    fechaPartida: '2025-09-03T11:00:00',
    fechaRegreso: '2025-09-10T17:00:00',
    ultimoDiaPago: '2025-08-13',
    anticipo: 4900
  },
  {
    id: 8,
    clave: 'MTY-PXM-1025',
    nombre: 'Playa del Carmen Exclusive',
    fechaPartida: '2025-10-07T08:00:00',
    fechaRegreso: '2025-10-14T22:00:00',
    ultimoDiaPago: '2025-09-16',
    anticipo: 9200
  },
  {
    id: 9,
    clave: 'QRO-TAP-1125',
    nombre: 'Tapachula Cultural Journey',
    fechaPartida: '2025-11-11T07:30:00',
    fechaRegreso: '2025-11-18T19:30:00',
    ultimoDiaPago: '2025-10-21',
    anticipo: 3200
  },
  {
    id: 10,
    clave: 'CDMX-SLP-1225',
    nombre: 'San Luis Potosí Mágico',
    fechaPartida: '2025-12-05T06:00:00',
    fechaRegreso: '2025-12-12T20:00:00',
    ultimoDiaPago: '2025-11-14',
    anticipo: 4100
  },
  {
    id: 11,
    clave: 'GDL-MID-0126',
    nombre: 'Mérida Cultural Premium',
    fechaPartida: '2026-01-09T09:00:00',
    fechaRegreso: '2026-01-16T21:00:00',
    ultimoDiaPago: '2025-12-19',
    anticipo: 6700
  },
  {
    id: 12,
    clave: 'MTY-CUU-0226',
    nombre: 'Chihuahua Adventure',
    fechaPartida: '2026-02-13T07:00:00',
    fechaRegreso: '2026-02-20T19:00:00',
    ultimoDiaPago: '2026-01-23',
    anticipo: 5800
  }
];
  

  filteredViajes = [...this.viajes];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  filterViajes() {
    this.filteredViajes = this.viajes.filter(viaje => {
      const matchesSearch = viaje.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          viaje.clave.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchesPrice = true;
      switch(this.priceFilter) {
        case 'low': matchesPrice = viaje.anticipo < 5000; break;
        case 'medium': matchesPrice = viaje.anticipo >= 5000 && viaje.anticipo <= 10000; break;
        case 'high': matchesPrice = viaje.anticipo > 10000; break;
      }
      
      return matchesSearch && matchesPrice;
    });
  }

  formatFechaHora(fecha: string): string {
    return new Date(fecha).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  selectViaje(viaje: any) {
    // Navegación relativa al path actual (trip-catalog)
    this.router.navigate(['contract', viaje.id], { relativeTo: this.route });
  }
}