import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Evento } from '../models/Evento';
import { Observable, map, take } from 'rxjs';
import { PaginatedResult } from '@app/models/Pagination';

@Injectable(
  //{  providedIn: 'root' }
)

export class EventoService {

  baseURL = 'https://localhost:7222/api/Eventos';

  constructor(private http: HttpClient) { }

  public getEventos(page?: number,
                    itemsPerPage?: number,
                    term?: string ): Observable<PaginatedResult<Evento[]>>
  {
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();
    let params = new HttpParams

    if (page !=  null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != ''){
      params = params.append('term', term)
    }

    return this.http
      .get<Evento[]>(this.baseURL, {observe: 'response', params})
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if(response.headers.has('Pagination')){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.baseURL, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.baseURL}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete(`${this.baseURL}/${id}`).pipe(take(1));
  }

}
