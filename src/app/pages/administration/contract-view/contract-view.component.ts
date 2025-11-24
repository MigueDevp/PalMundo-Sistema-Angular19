import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, 
  faFileContract, 
  faEye, 
  faTimes,
  faCalendarAlt,
  faDollarSign,
  faUser,
  faClipboardList,
  faFilter,
  faFilterCircleXmark
} from '@fortawesome/free-solid-svg-icons';

interface Contract {
  folio: string;
  fecha: string;
  servicio: string;
  monto: number;
  descripcion: string;
}

interface ClientResult {
  titular: string;
  folio: string;
  contracts: Contract[];
}

@Component({
  selector: 'app-contract-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './contract-view.component.html',
  styleUrls: ['./contract-view.component.css']
})
export class ContractViewComponent implements OnInit {
  // Icons
  faSearch = faSearch;
  faFileContract = faFileContract;
  faEye = faEye;
  faTimes = faTimes;
  faCalendarAlt = faCalendarAlt;
  faDollarSign = faDollarSign;
  faUser = faUser;
  faClipboardList = faClipboardList;
  faFilter = faFilter;
  faFilterCircleXmark = faFilterCircleXmark;

  searchTerm: string = '';
  searchResults: ClientResult[] = [];
  selectedClient: ClientResult | null = null;
  viewedContract: Contract | null = null;

  // Filter properties
  showFilters: boolean = true;
  filterServiceType: string = '';
  filterDateFrom: string = '';
  filterDateTo: string = '';
  filterAmountMin: number | null = null;
  filterAmountMax: number | null = null;
  filteredContracts: Contract[] = [];

  // Simulación de datos
  mockClients: ClientResult[] = [
    {
      titular: 'Juan Pérez',
      folio: 'C-001',
      contracts: [
        {
          folio: 'C-001',
          fecha: '2025-07-01',
          servicio: 'Transporte Escolar',
          monto: 5000,
          descripcion: 'Servicio de transporte escolar para el ciclo 2025.'
        },
        {
          folio: 'C-002',
          fecha: '2025-07-10',
          servicio: 'Viaje Turístico',
          monto: 12000,
          descripcion: 'Viaje turístico a Cancún para 20 personas.'
        },
        {
          folio: 'C-004',
          fecha: '2025-08-15',
          servicio: 'Transporte Ejecutivo',
          monto: 7500,
          descripcion: 'Transporte ejecutivo para eventos corporativos.'
        },
        {
          folio: 'C-005',
          fecha: '2025-09-20',
          servicio: 'Viaje Turístico',
          monto: 15000,
          descripcion: 'Viaje turístico a Guadalajara.'
        },
        {
          folio: 'C-006',
          fecha: '2025-10-05',
          servicio: 'Transporte Escolar',
          monto: 4500,
          descripcion: 'Transporte escolar mes de octubre.'
        }
      ]
    },
    {
      titular: 'María López',
      folio: 'C-003',
      contracts: [
        {
          folio: 'C-003',
          fecha: '2025-06-15',
          servicio: 'Transporte Ejecutivo',
          monto: 8000,
          descripcion: 'Transporte ejecutivo mensual.'
        },
        {
          folio: 'C-007',
          fecha: '2025-07-20',
          servicio: 'Viaje Turístico',
          monto: 18000,
          descripcion: 'Viaje turístico a Mazatlán.'
        },
        {
          folio: 'C-008',
          fecha: '2025-08-10',
          servicio: 'Transporte Ejecutivo',
          monto: 9000,
          descripcion: 'Transporte ejecutivo para conferencia.'
        }
      ]
    }
  ];

  ngOnInit() {
    this.applyFilters();
  }

  buscarClientes() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.searchResults = [];
      this.selectedClient = null;
      return;
    }
    this.searchResults = this.mockClients.filter(
      c =>
        c.titular.toLowerCase().includes(term) ||
        c.folio.toLowerCase().includes(term) 
    );
    this.selectedClient = null;
  }

  seleccionarCliente(client: ClientResult) {
    this.selectedClient = client;
    this.viewedContract = null;
    this.searchResults = [];
    this.searchTerm = client.titular;
    // Clear filters when selecting a specific client
    this.clearFilters();
  }

  verContrato(contract: Contract) {
    this.viewedContract = contract;
  }

  cerrarDetalleContrato() {
    this.viewedContract = null;
  }

  // Filter methods
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    // Get all contracts from all clients
    let allContracts: Contract[] = [];
    
    this.mockClients.forEach(client => {
      allContracts = allContracts.concat(client.contracts);
    });

    let contracts = [...allContracts];

    // Filter by service type
    if (this.filterServiceType) {
      contracts = contracts.filter(c => c.servicio === this.filterServiceType);
    }

    // Filter by date range
    if (this.filterDateFrom) {
      contracts = contracts.filter(c => c.fecha >= this.filterDateFrom);
    }
    if (this.filterDateTo) {
      contracts = contracts.filter(c => c.fecha <= this.filterDateTo);
    }

    // Filter by amount range
    if (this.filterAmountMin !== null) {
      contracts = contracts.filter(c => c.monto >= this.filterAmountMin!);
    }
    if (this.filterAmountMax !== null) {
      contracts = contracts.filter(c => c.monto <= this.filterAmountMax!);
    }

    this.filteredContracts = contracts;
  }

  clearFilters() {
    this.filterServiceType = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.filterAmountMin = null;
    this.filterAmountMax = null;
    this.applyFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filterServiceType) count++;
    if (this.filterDateFrom) count++;
    if (this.filterDateTo) count++;
    if (this.filterAmountMin !== null) count++;
    if (this.filterAmountMax !== null) count++;
    return count;
  }

  hasActiveFilters(): boolean {
    return this.getActiveFiltersCount() > 0;
  }

  getAllUniqueServiceTypes(): string[] {
    const allServices: string[] = [];
    this.mockClients.forEach(client => {
      client.contracts.forEach(contract => {
        if (!allServices.includes(contract.servicio)) {
          allServices.push(contract.servicio);
        }
      });
    });
    return allServices.sort();
  }

  getUniqueServiceTypes(): string[] {
    return this.getAllUniqueServiceTypes();
  }
}
