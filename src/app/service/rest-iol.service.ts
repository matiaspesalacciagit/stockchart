
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { TokenIOL, TituloLess, Cotizacion, Opcion } from '../model/model';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface ComprarResponse {
  ok?: boolean;
  messages?: { title: string; description: string }[];
  numeroOperacion?: number;
}

export interface OperacionesReponse {
  message?: string;
  numero: number;
  mercado: string;
  simbolo: string;
  moneda: string;
  tipo: string;
  fechaAlta: Date;
  validez: Date;
  fechaOperado?: any;
  estadoActual: string;
  estados: {
    detalle: string,
    fecha: string }[];
  aranceles: any[];
  operaciones: any[];
  precio: number;
  cantidad: number;
  monto: number;
  modalidad: string;
}


@Injectable({
  providedIn: 'root'
})
export class RestIolService {
  // https://api.invertironline.com
  endpoint = '';
  token: TokenIOL;
  serieHistorica: any[];
  tituloLess: TituloLess;

  constructor(private http: HttpClient) {}

  logIn(username: string, password: string, granType: string): Observable<any> {
    const url = this.endpoint + '/token';
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', granType);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Cache-Control', 'no-cache');
    localStorage.setItem('cred', JSON.stringify({ username, password }));
    return this.http.post(url, body.toString(), { headers });
  }

  setUserLogged(): any {
    localStorage.setItem('token', JSON.stringify(this.token));
  }

  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem('token'));
  }

  logout(): any {
    this.token = null;
    localStorage.setItem('token', null);
  }

  buscarOpciones(mercado: string, simbolo: string) {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + mercado + '/Titulos/' + simbolo + '/Opciones';
      return this.http.get<Opcion[]>(url, {
        headers: new HttpHeaders({ Authorization: autToken, 'Content-Type': 'application/x-www-form-urlencoded' })
      });
    }
    //Todo tirar una observable fallando.
    return null;
  }

  buscaSerieHistorica(mercado: string, simbolo: string, fechaDesde: string, fechaHasta: string, ajustada: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = `${this.endpoint}/api/v2/${mercado}/Titulos/${simbolo}/Cotizacion/seriehistorica/${fechaDesde}/${fechaHasta}/${ajustada}`;
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }

  buscarTitulo(mercado: string, simbolo: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + mercado + '/Titulos/' + simbolo;
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }

  obtenerCotizacion(mercado: string, simbolo: string): Observable<Cotizacion> {
    if (this.token && this.token.access_token) {
      const Authorization = `Bearer ${this.token.access_token}`;
      const url = `${this.endpoint}/api/v2/${mercado}/Titulos/${simbolo}/Cotizacion`;
      const headers = new HttpHeaders({ Authorization });

      return this.http.get<Cotizacion>(url, { headers }).pipe(map(cotizacion => ({ ...cotizacion, simbolo })));
    }
    return null;
  }

  buscarInstrumentos(pais: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + pais + '/Titulos/Cotizacion/Instrumentos';
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }
  buscarPaneles(pais: string, instrumento: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + pais + '/Titulos/Cotizacion/Paneles/' + instrumento;
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }

  buscarActivos(instrumento: string, panel: string, pais: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/Cotizaciones/' + instrumento + '/' + panel + '/' + pais;
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }

  estadoDeCuenta() {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/estadocuenta';
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }

  portafolio() {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/portafolio';
      return this.http.get(url, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }

  operaciones(numero: string): Observable<OperacionesReponse> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/operaciones' + numero;
      return this.http.get<OperacionesReponse>(url, { headers: new HttpHeaders({ Authorization: autToken }) }).pipe(
        catchError(error => throwError({message: 'Connection ERROR!'})),
        switchMap(data => {
          if (data.message) {
            return throwError(data);
          }
          return of(data);
        })
      );
    }
    return throwError({
      message: 'ERROR - NO TOKEN'
    });
  }

  comprar(mercado: string, simbolo: string, cantidad: string, precio: string, validez: string, plazo: string): Observable<ComprarResponse> {
    const orden = { mercado, simbolo, cantidad, precio, plazo, validez };
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/operar/Comprar';
      return this.http.post<ComprarResponse>(url, orden, { headers: new HttpHeaders({ Authorization: autToken }) }).pipe(
        catchError(error =>
          throwError({
            ok: false,
            messages: [
              {
                title: 'Connection ERROR!',
                description: JSON.stringify(error),
              }
            ]
          })
        ),
        switchMap(data => {
          if (data.ok === false) {
            return throwError(data);
          }
          return of(data);
        })
      );
    }
    const errorResponse: ComprarResponse = {
      ok: false,
      messages: [
        {
          title: 'ERROR - NO TOKEN',
          description: 'No se hay un token activo'
        }
      ]
    };
    return throwError(errorResponse);
  }


  vender(mercado: string, simbolo: string, cantidad: string, precio: string, validez: string, plazo: string): Observable<ComprarResponse> {
    const orden = { mercado, simbolo, cantidad, precio, plazo, validez };
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/operar/Vender';
      return this.http.post<ComprarResponse>(url, orden, { headers: new HttpHeaders({ Authorization: autToken }) }).pipe(
        catchError(error =>
          throwError({
            ok: false,
            messages: [
              {
                title: 'Connection ERROR!',
                description: JSON.stringify(error),
              }
            ]
          })
        ),
        switchMap(data => {
          if (data.ok === false) {
            return throwError(data);
          }
          return of(data);
        })
      );
    }
    const errorResponse: ComprarResponse = {
      ok: false,
      messages: [
        {
          title: 'ERROR - NO TOKEN',
          description: 'No se hay un token activo'
        }
      ]
    };
    return throwError(errorResponse);
  }

  /*
  vender(mercado: string, simbolo: string, cantidad: string, precio: string, validez: string, plazo: string) {
    const orden = { mercado, simbolo, cantidad, precio, plazo, validez };
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/operar/Vender';
      return this.http.post(url, orden, { headers: new HttpHeaders({ Authorization: autToken }) });
    }
    return null;
  }*/
}
