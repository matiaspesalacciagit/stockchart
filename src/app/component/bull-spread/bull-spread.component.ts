import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { combineLatest, EMPTY, interval, Observable, Subject, merge } from 'rxjs';
import { map, startWith, switchMap, tap, withLatestFrom, catchError, retry } from 'rxjs/operators';
import { Cotizacion, Puntas } from 'src/app/model/model';
import { DateService } from '../../service/date.service';
import { RestService } from '../../service/rest.service';

export interface Par {
  callAComprar: Cotizacion;
  callALanzar: Cotizacion;
  diferencia: number;
  distancia: number;
  sirve: boolean;
}

@Component({
  selector: 'app-bull-spread',
  templateUrl: './bull-spread.component.html',
  styleUrls: ['./bull-spread.component.scss']
})
export class BullSpreadComponent implements OnInit {
  //  @Input('activoSubyacente') @AsObservable() activoSubyacente$: Observable<Cotizacion>;

  // BCBA GGAL

  constructor(private iolService: RestService, private fb: FormBuilder, public dateService: DateService) {}

  title = 'Bull Spread';
  subTitle = 'Cotizaciones';

  cols: any[] = [
    { field: 'diferenciaEntreBases', header: 'diferenciaEntreBases' },
    { field: 'puntaje', header: 'puntaje' },
    { field: 'gananciaPorPesoInvertido', header: 'gananciaPorPesoInvertido' },
    { field: 'costoInicial', header: 'costoInicial' },
    { field: 'ganancaMaxima', header: 'ganancaMaxima' },
    { field: 'precioCompra', header: 'precioCompra' },
    { field: 'precioVenta', header: 'precioVenta' },
    { field: 'simboloCompra', header: 'simboloCompra' },
    { field: 'simboloVenta', header: 'simboloVenta' }
  ];

  form = this.fb.group({
    subyacente: ['GGAL'],
    month: ['JU'],
    loteOperar: ['10'],
    autorefresh: [false]
  });

  searchSubject = new Subject<void>();
  search$ = this.searchSubject.asObservable();

  selectedMonth$: Observable<string> = this.form.get('month').valueChanges.pipe(startWith(this.form.get('month').value));
  changeLotes$: Observable<string> = this.form.get('loteOperar').valueChanges.pipe(startWith(this.form.get('loteOperar').value));

  autorefesh$ = this.form.get('autorefresh').valueChanges.pipe(
    startWith(this.form.get('autorefresh').value),
    switchMap(status => {
      console.log('STATUS', status);
      return status ? interval(20000).pipe() : EMPTY;
    })
  );

  // ultimate courses => mgalante@gmail.com / Baile786u
  /*
  simboloActivoSubyacente$ = this.form.get('subyacente').valueChanges.pipe(
    startWith(this.form.get('subyacente').value)
  );

  activoSubyacente$ = this.simboloActivoSubyacente$.pipe(
    switchMap(simbolo =>
      this.iolService.obtenerCotizacion('BCBA', simbolo)
    )
  );
*/
  info$ = merge(this.search$, this.autorefesh$).pipe(
    switchMap(() =>
      this.iolService.obtenerCotizacion('BCBA', this.form.get('subyacente').value)
    ),
    withLatestFrom(this.selectedMonth$, this.changeLotes$),
    switchMap(([activoSubyacente, month]) => this.getCotizaciones(activoSubyacente, month)),
    map(cotizaciones => this.getBullData(cotizaciones)),
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
    for (const punta of puntas) {
      lote -= punta.cantidadCompra;
      if (lote <= 0) {
        return punta.precioCompra;
      }
    }
    return null;
  }

  getCompraReal(puntas: Puntas[], lote: number) {
    for (const punta of puntas) {
      lote -= punta.cantidadVenta;
      if (lote <= 0) {
        return punta.precioVenta;
      }
    }
    return null;
  }

  getBullData(cotizaciones: Cotizacion[]) {
    const pares: any[] = [];
    for (let i = 0; i < cotizaciones.length - 1; i++) {
      const callAComprar = cotizaciones[i];
      for (let j = i + 1; j < cotizaciones.length; j++) {
        const callALanzar = cotizaciones[j];
        const precioCompra = this.getCompraReal(callAComprar.puntas, 1);
        const precioVenta = this.getVentaReal(callALanzar.puntas, 1);

        if (!precioCompra || !precioVenta) {
          continue;
        }

        const diferenciaEntreBases = callALanzar.base - callAComprar.base;
        const costoInicial = precioCompra - precioVenta;
        const puntoMuerto = callAComprar.base + costoInicial;
        const gananciaMaxima = callALanzar.base - callAComprar.base - costoInicial;

        const par: any = {
          diferenciaEntreBases,
          puntaje: costoInicial / diferenciaEntreBases,
          gananciaPorPesoInvertido: diferenciaEntreBases / costoInicial - 1,
          costoInicial,
          //puntoMuerto,
          ganancaMaxima: gananciaMaxima,
          precioCompra,
          precioVenta,
          //callAComprarBase: callAComprar.base,
          //callALanzarBase: callALanzar.base,
          simboloCompra: callAComprar.simbolo,
          simboloVenta: callALanzar.simbolo
        };

        // if(par.puntaje > 0.5) {
        pares.push(par);
        //}
      }
    }
    return pares.sort((x, y) => x.puntaje - y.puntaje);
    // vender la que esta OTM
  }

  ngOnInit(): void {
    this.searchSubject.next();
  }

  search() {
    this.searchSubject.next();
  }

  getCotizaciones(activoSubyacente: Cotizacion, month: string) {
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
        );
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

  aplicarFiltro(base: string, activoSubyacente: Cotizacion, month: string): boolean {
    const bolMes =  base.substr(-2).indexOf(month) !== -1;
    const bolTipo = base.substring(3, 4) === 'C';
    const baseN = Number(base.match(/-?\d*\.?\d+/g));
    const utlimoPrecio = activoSubyacente.ultimoPrecio;
    const moneyOk = Math.abs(baseN - activoSubyacente.ultimoPrecio) / utlimoPrecio <= 0.1;
    return bolMes && bolTipo && moneyOk;
  }
}
