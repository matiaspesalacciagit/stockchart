import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenIOL, TituloLess, Cotizacion } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  // https://api.invertironline.com
  endpoint = "";                            
  token: TokenIOL;
  serieHistorica: Array<Object>;
  tituloLess: TituloLess;
 
  constructor(private http: HttpClient) { }

  logIn(username: string, password: string, granType: string): Observable<any> {
    const url = this.endpoint + '/token';
    const body = new HttpParams().set('username', username).set('password', password).set('grant_type', granType);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Cache-Control', 'no-cache');
    return this.http.post(url, body.toString(), { headers: headers });
  }

  setUserLogged(): any {
    localStorage.setItem('token', JSON.stringify(this.token));
  }

  getUserLoggedIn() {
  	return JSON.parse(localStorage.getItem('token'));
  }
  
  logout(): any{
    this.token = null;
    localStorage.setItem('token', null);
  }

  buscarOpciones(mercado: string, simbolo: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + mercado + '/Titulos/' + simbolo + '/Opciones';
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken, 'Content-Type': 'application/x-www-form-urlencoded' }) } );
    }
    return null;
  }

  buscaSerieHistorica(mercado: string, simbolo: string, fechaDesde: string, fechaHasta: string, ajustada: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + mercado + '/Titulos/' + simbolo + '/Cotizacion/seriehistorica/'+ fechaDesde + "/" + fechaHasta + "/" + ajustada ;
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken})} );
    }
    return null;
  }

  buscarTitulo(mercado: string, simbolo: string):  Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + mercado + '/Titulos/' + simbolo;
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken})} );
    }
    return null;
  }

  obtenerCotizacion(mercado: string, simbolo: string):  Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + mercado + '/Titulos/' + simbolo + '/Cotizacion';
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken})} );
    }
    return null;
  }

  buscarInstrumentos(pais: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + pais + '/Titulos/Cotizacion/Instrumentos';
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken})} );
    }
    return null;
  }
  buscarPaneles(pais: string, instrumento: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/' + pais + '/Titulos/Cotizacion/Paneles/'+ instrumento;
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken})} );
    }
    return null;
  }

  buscarActivos(instrumento: string, panel: string, pais: string): Observable<any> {
    if (this.token && this.token.access_token) {
      const autToken = 'Bearer ' + this.token.access_token;
      const url = this.endpoint + '/api/v2/Cotizaciones/'+ instrumento + '/' + panel +'/' + pais;
      return this.http.get(url, {headers : new HttpHeaders( {'Authorization': autToken})} );
    }
    return null;
  }

}