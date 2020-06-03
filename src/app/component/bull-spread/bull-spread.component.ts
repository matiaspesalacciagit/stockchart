import { Component, OnInit, Input } from '@angular/core';
import { RestService } from '../../service/rest.service';
import { DateService } from '../../service/date.service';
import { FormBuilder } from '@angular/forms';
import { Cotizacion, Puntas } from 'src/app/model/model';
import { Observable, Subject, of, combineLatest} from 'rxjs';
import { switchMap, switchMapTo, map, withLatestFrom, startWith, distinctUntilChanged, tap} from 'rxjs/operators';
import { AsObservable } from 'ngx-propserve';


export interface Par {
  callAComprar: Cotizacion; 
  callALanzar:Cotizacion; 
  diferencia: number; 
  distancia: number;
  sirve: boolean;
}

@Component({
  selector: 'app-bull-spread',
  templateUrl: './bull-spread.component.html',
  styleUrls: ['./bull-spread.component.scss']
})
export class BullSpreadComponent implements OnInit{

  @Input('activoSubyacente') @AsObservable() activoSubyacente$: Observable<Cotizacion>;
  constructor(
    private iolService: RestService, 
    private fb: FormBuilder,
    public dateService: DateService) { }

  form = this.fb.group({
    subyacente: ['COME'],
    month: ['JU'],
    loteOperar: ['10']
  });
  
  searchSubject = new Subject<void>();
  search$ = this.searchSubject.asObservable(); 
  selectedMonth$: Observable<string> = this.form.get('month').valueChanges.pipe(
    startWith(this.form.get('month').value)
  ); 

  changeLotes$: Observable<string> = this.form.get('loteOperar').valueChanges.pipe(
    startWith(this.form.get('loteOperar').value)
  );

  // ultimate courses => mgalante@gmail.com / Baile786u

  
  info$ = this.search$.pipe(    
    switchMapTo(this.activoSubyacente$),
    withLatestFrom(this.selectedMonth$, this.changeLotes$),
    switchMap(([activoSubyacente, month]) => this.getCotizaciones(
      activoSubyacente, month)
    ),
    map(cotizaciones => this.getBullData(cotizaciones))
  );

  opcionesFiltradas: Cotizacion[] = [];
//  B    PC  / PV
// 100  1.50/1.80     YYYY
// 103  3.40/3.70     YYYY
// 105  5.80/5.90     YYYY
// 108  5.90/6.00     YYYY
// 111


// Subyancte 102
//       _______
//      /
//     /
// ___/

  getVentaReal(puntas: Puntas[], lote: number) {    
    for(const punta of puntas){
      lote -= punta.cantidadCompra;
      if(lote <= 0){
        return punta.precioCompra;
      }
    }
    return null;
  }

  getCompraReal(puntas: Puntas[], lote: number) {    
    for(const punta of puntas){
      lote -= punta.cantidadVenta;
      if(lote <= 0){
        return punta.precioVenta;
      }
    }
    return null;
  }

  getBullData(cotizaciones: Cotizacion[]) {

    const pares: any[] = [];
    for(let i = 0; i < cotizaciones.length - 1; i++) {
      const callAComprar = cotizaciones[i];
      for(let j = i+1; j < cotizaciones.length; j++) {
        const callALanzar = cotizaciones[j];
        const precioCompra = this.getCompraReal(callAComprar.puntas, 1);
        const precioVenta = this.getVentaReal(callALanzar.puntas, 1);
        
        if(!precioCompra || !precioVenta) {
          continue;
        }
        
        const diferenciaEntreBases = callALanzar.base - callAComprar.base;
        const costoInicial = precioCompra - precioVenta;
        const puntoMuerto = callAComprar.base + costoInicial;
        const gananciaMaxima = callALanzar.base - callAComprar.base - costoInicial;
        

        const par: any = {   
          diferenciaEntreBases,
          puntaje: costoInicial/diferenciaEntreBases,
          gananciaPorPesoInvertido: (diferenciaEntreBases/costoInicial) - 1,
          costoInicial,
          //puntoMuerto,
          ganancaMaxima: gananciaMaxima,
          precioCompra,
          precioVenta,
          //callAComprarBase: callAComprar.base,
          //callALanzarBase: callALanzar.base,
          simboloCompra: callAComprar.simbolo,
          simboloVenta: callALanzar.simbolo,
        }        
       
       // if(par.puntaje > 0.5) {
          pares.push(par);
        //}
      }
    }
    return pares.sort( (x, y) => x.puntaje - y.puntaje);
    // vender la que esta OTM
  }
      
  ngOnInit(): void {
    this.searchSubject.next();
  }

  search() {
    this.searchSubject.next();
  }


  getCotizaciones(activoSubyacente: Cotizacion, month: string){    
    /* const cacheOpciones = localStorage.getItem('getOpciones');
    if(cacheOpciones){
      return of(JSON.parse(cacheOpciones));
    } */
    return this.iolService.buscarOpciones('BCBA', activoSubyacente.simbolo).pipe(
      map(opciones => opciones.filter(opcion => this.aplicarFiltro(opcion.simbolo, activoSubyacente, month))),
      switchMap(opciones => {
        const apiCalls = opciones.map(element => 
          this.iolService.obtenerCotizacion('BCBA', element.simbolo).pipe(
            map(opcion => ({
              ...opcion,
              base: Number(element.simbolo.match(/-?\d*\.?\d+/g))
           }))
          )
        )
        return combineLatest(apiCalls);
      }),
      tap(opciones => {
        //localStorage.setItem('getOpciones', JSON.stringify(opciones));
      })
    );
  }
              

  clearCache() {
    //localStorage.removeItem('getOpciones');
  }


  aplicarFiltro(base : string, activoSubyacente: Cotizacion, month: string, ) : boolean {
    let bolMes = !!~base.substr(-2).indexOf(month);
    let bolTipo =  base.substring(3,4) === 'C';
    let baseN = Number(base.match(/-?\d*\.?\d+/g));
    let utlimoPrecio = activoSubyacente.ultimoPrecio;
    let moneyOk = Math.abs(baseN - activoSubyacente.ultimoPrecio)/utlimoPrecio <= 0.10;
    return bolMes && bolTipo && moneyOk;
  }

}
