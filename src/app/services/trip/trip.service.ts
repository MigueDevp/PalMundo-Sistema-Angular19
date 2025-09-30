import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Updated interfaces to match your database schema
export interface Trip {
  id_viaje?: number;
  clave: string;
  nombre_viaje: string;
  fecha_partida: string;
  fecha_regreso: string;
  ultimo_dia_pagar: string;
  cantidad_anticipo: number;
  precio_adulto: number;
  precio_menor: number;
  precio_infante: number;
  servicios_incluidos: string[];
  servicios_no_incluidos: string[];
  itinerario: string;
  estado_viaje?: 'programado' | 'completado' | 'cancelado' ;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  usuario_creacion?: string;
  activo?: boolean;
}

export interface TripResponse {
  success: boolean;
  data: Trip | Trip[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:3000/api/trips';
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('TripService initialized - ready to connect to backend');
  }

  /**
   * Gets all trips
   */
  getTrips(): Observable<Trip[]> {
    console.log('🔄 Fetching trips from backend API...');
    
    return this.http.get<TripResponse>(`${this.apiUrl}`).pipe(
      tap(response => console.log('✅ Backend response:', response)),
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          this.tripsSubject.next(response.data as Trip[]);
          return response.data as Trip[];
        } else {
          throw new Error(response.message || 'Invalid response format');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gets a specific trip by ID
   */
  getTripById(id: number): Observable<Trip | null> {
    console.log(`🔍 Fetching trip ID ${id} from backend...`);
    
    return this.http.get<TripResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success) {
          return response.data as Trip;
        } else {
          return null;
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new trip
   */
  createTrip(trip: Omit<Trip, 'id_viaje'>): Observable<TripResponse> {
    console.log('➕ Creating new trip in backend:', trip);
    
    return this.http.post<TripResponse>(`${this.apiUrl}`, trip).pipe(
      tap(response => {
        if (response.success) {
          const currentTrips = this.tripsSubject.value;
          const newTrip = response.data as Trip;
          this.tripsSubject.next([...currentTrips, newTrip]);
          console.log('✅ Trip created successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing trip
   */
  updateTrip(id: number, updatedTrip: Partial<Trip>): Observable<TripResponse> {
    console.log(`✏️ Updating trip ID ${id} in backend:`, updatedTrip);
    
    return this.http.put<TripResponse>(`${this.apiUrl}/${id}`, updatedTrip).pipe(
      tap(response => {
        if (response.success) {
          const currentTrips = this.tripsSubject.value;
          const updatedTrips = currentTrips.map(trip => 
            trip.id_viaje === id ? (response.data as Trip) : trip
          );
          this.tripsSubject.next(updatedTrips);
          console.log('✅ Trip updated successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a trip
   */
  deleteTrip(id: number): Observable<TripResponse> {
    console.log(`🗑️ Deleting trip ID ${id} from backend...`);
    
    return this.http.delete<TripResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        if (response.success) {
          const currentTrips = this.tripsSubject.value;
          const filteredTrips = currentTrips.filter(trip => trip.id_viaje !== id);
          this.tripsSubject.next(filteredTrips);
          console.log('✅ Trip deleted successfully');
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Searches trips by name or clave
   */
  searchTrips(term: string): Observable<Trip[]> {
    console.log(`🔍 Searching trips with term: "${term}"`);
    
    if (!term.trim()) {
      return this.getTrips();
    }

    return this.http.get<TripResponse>(`${this.apiUrl}/search/${encodeURIComponent(term)}`).pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data as Trip[];
        } else {
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos enviados al servidor';
          break;
        case 404:
          errorMessage = 'Viaje no encontrado';
          break;
        case 500:
          errorMessage = error.error?.message || 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.error?.message || error.message}`;
      }
    }

    console.error('❌ Error en TripService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}

