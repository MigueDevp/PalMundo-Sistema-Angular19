import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-view.component.html',
  styleUrls: ['./contract-view.component.css']
})
export class ContractViewComponent {
  searchTerm: string = '';
  searchResults: ClientResult[] = [];
  selectedClient: ClientResult | null = null;
  viewedContract: Contract | null = null;

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
        }
      ]
    }
  ];

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
  }

  verContrato(contract: Contract) {
    this.viewedContract = contract;
  }

  cerrarDetalleContrato() {
    this.viewedContract = null;
  }
}
