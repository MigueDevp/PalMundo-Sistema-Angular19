import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Interfaces that define the data contract - matching your exact structure
export interface Client {
  id_cliente?: number;
  nombre: string;
  fecha_nacimiento: string;
  direccion: string;
  numero_telefono: string;
  correo: string;
  sexo: string;
  fecha_creacion?: string;
  usuario_creacion?: string;
  fecha_modificacion?: string;
  activo?: boolean;
}

export interface ClientResponse {
  success: boolean;
  data: Client | Client[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  // URL base del API - cambia esto según tu configuración
  private apiUrl = 'http://localhost:3000/api/clients';
  
  // BehaviorSubject to maintain reactive state of clients
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  
  // Public observable for components to subscribe to
  public clients$ = this.clientsSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('ClientService initialized - ready to connect to backend');
  }

  /**
   * Gets all clients from the backend
   * REEMPLAZA los datos simulados con una llamada HTTP real
   */
  getClients(): Observable<Client[]> {
    console.log('🔄 Fetching clients from backend API...');
    
    return this.http.get<ClientResponse>(`${this.apiUrl}`).pipe(
      tap(response => console.log('✅ Backend response:', response)),
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          // Actualizar el BehaviorSubject con los datos del backend
          this.clientsSubject.next(response.data as Client[]);
          return response.data as Client[];
        } else {
          throw new Error(response.message || 'Invalid response format');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gets a specific client by ID from backend
   */
  getClientById(id: number): Observable<Client | null> {
    console.log(`🔍 Fetching client ID ${id} from backend...`);
    
    return this.http.get<ClientResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          return response.data as Client;
        } else {
          return null;
        }
      }),
      catchError(this.handleError)
    );
  }

  // En client.service.ts - modificar createClient
createClient(client: Omit<Client, 'id_cliente'> & { usuario_creacion: string }): Observable<ClientResponse> {
  console.log('➕ Creating new client in backend:', client);
  
  return this.http.post<ClientResponse>(`${this.apiUrl}`, client).pipe(
    tap(response => {
      if (response.success) {
        const currentClients = this.clientsSubject.value;
        const newClient = response.data as Client;
        this.clientsSubject.next([...currentClients, newClient]);
        console.log('✅ Client created successfully');
      }
    }),
    catchError(this.handleError)
  );
}

  /**
   * Updates an existing client in the backend
   */
  updateClient(id: number, updatedClient: Partial<Client>): Observable<ClientResponse> {
    console.log(`✏️ Updating client ID ${id} in backend:`, updatedClient);
    
    return this.http.put<ClientResponse>(`${this.apiUrl}/${id}`, updatedClient).pipe(
      tap(response => {
        if (response.success) {
          // Actualizar la lista local reemplazando el cliente modificado
          const currentClients = this.clientsSubject.value;
          const updatedClients = currentClients.map(client => 
            client.id_cliente === id ? (response.data as Client) : client
          );
          this.clientsSubject.next(updatedClients);
          console.log('✅ Client updated successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a client from the backend
   */
  deleteClient(id: number): Observable<ClientResponse> {
    console.log(`🗑️ Deleting client ID ${id} from backend...`);
    
    return this.http.delete<ClientResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        if (response.success) {
          // Actualizar la lista local removiendo el cliente eliminado
          const currentClients = this.clientsSubject.value;
          const filteredClients = currentClients.filter(client => client.id_cliente !== id);
          this.clientsSubject.next(filteredClients);
          console.log('✅ Client deleted successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Searches clients by name in the backend
   */
  searchClients(term: string): Observable<Client[]> {
    console.log(`🔍 Searching clients with term: "${term}"`);
    
    if (!term.trim()) {
      return this.getClients(); // Si no hay término, devolver todos
    }

    return this.http.get<ClientResponse>(`${this.apiUrl}/search/${encodeURIComponent(term)}`).pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as Client[];
        } else {
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:3000';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos enviados al servidor';
          break;
        case 404:
          errorMessage = 'Cliente no encontrado';
          break;
        case 500:
          errorMessage = error.error?.message || 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.error?.message || error.message}`;
      }
    }

    console.error('❌ Error en ClientService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };

  /**
   * Método de utilidad para verificar la conexión con el backend
   */
  testConnection(): Observable<any> {
    console.log('🔌 Testing backend connection...');
    
    return this.http.get(`http://localhost:3000/api/health`).pipe(
      tap(response => console.log('✅ Backend connection successful:', response)),
      catchError(error => {
        console.error('❌ Backend connection failed:', error);
        return throwError(() => new Error('No se puede conectar al backend'));
      })
    );
  }
}