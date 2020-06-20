import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, combineLatest, EMPTY, interval, merge, Observable, Subject } from 'rxjs';
import { map, publishReplay, refCount, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Cotizacion, Puntas } from 'src/app/model/model';
import { OperateService } from 'src/app/service/operate.service';
import { WhatsAppService } from 'src/app/service/whats-app.service';
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
export class BullSpreadComponent {
  //  @Input('activoSubyacente') @AsObservable() activoSubyacente$: Observable<Cotizacion>;

  // BCBA GGAL

  constructor(
    private iolService: RestService,
    private fb: FormBuilder,
    public dateService: DateService,
    private whatsapp: WhatsAppService,
    private operateService: OperateService
    ) {}

  titleBull = 'Bull Spread';
  subTitleBull = 'Cotizaciones';
  titleBear = 'Bear Spread';
  subTitleBear = 'Cotizaciones';
  sortFieldBull = 'puntaje';
  sortFieldBear = 'puntajeBear';
  
  colsBull: any[] = [
    { field: 'puntaje', header: 'Puntaje' },
    { field: 'diferenciaEntreBases', header: 'Dif Bases' },
    { field: 'costoInicial', header: 'Costo' },
    { field: 'precioCompra', header: 'Precio Compra' },
    { field: 'precioVenta', header: 'Precio Venta' },
    { field: 'ganancaMaxima', header: 'Ganancia Máxima' },
    { field: 'gananciaPorPesoInvertido', header: 'Ganancia x $' },
    { field: 'simboloCompra', header: 'Simb Compra' },
    { field: 'simboloVenta', header: 'Simb Vta' }
  ];

  colsBear: any[] = [
    { field: 'puntajeBear', header: 'Puntaje' },
    { field: 'diferenciaEntreBases', header: 'Dif Bases' },
    { field: 'costoInicialBear', header: 'Costo' },
    { field: 'precioCompraBear', header: 'Precio Compra' },
    { field: 'precioVentaBear', header: 'Precio Venta' },
    { field: 'ganancaMaximaBear', header: 'Ganancia Máxima' },
    { field: 'gananciaPorPesoInvertido', header: 'Ganancia x $' },
    { field: 'simboloCompra', header: 'Simb Vta' },
    { field: 'simboloVenta', header: 'Simb Compra' }
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

// NO VA;
  currentSubyacenteSubject = new BehaviorSubject<string>(null); 
  currentSubyacente$ =  this.currentSubyacenteSubject.asObservable();

  // currentSubyacenteValue$ = this.currentSubyacente$.pipe(
  //   distinctUntilChanged(),
  //   switchMap(subyacente =>
  //     this.iolService.obtenerCotizacion('BCBA', subyacente)
  //   )
  // );



  subyacente$ = merge(this.search$, this.autorefesh$).pipe(
    switchMap(() =>
      this.iolService.obtenerCotizacion('BCBA', this.form.get('subyacente').value)
    ),
    publishReplay(1),
    refCount()
  );
  

 info$ = this.subyacente$.pipe(
    withLatestFrom(this.selectedMonth$, this.changeLotes$),
    switchMap(([activoSubyacente, month]) => this.getCotizaciones(activoSubyacente, month)),
    map(cotizaciones => this.getBullData(cotizaciones)),
    publishReplay(1),
    refCount()
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
    const paresBear: any[] = [];
    for (let i = 0; i < cotizaciones.length - 1; i++) {
      const callBaseMenor = cotizaciones[i];
      for (let j = i + 1; j < cotizaciones.length; j++) {
        const callBaseMayor = cotizaciones[j];
        const precioCompra = this.getCompraReal(callBaseMenor.puntas, 1);
        const precioVenta = this.getVentaReal(callBaseMayor.puntas, 1);
        const precioCompraBear = this.getCompraReal(callBaseMayor.puntas, 1);
        const precioVentaBear = this.getVentaReal(callBaseMenor.puntas, 1);

        if (!precioCompra || !precioVenta || !precioCompraBear || !precioVentaBear) {
          continue;
        }

        const diferenciaEntreBases = callBaseMayor.base - callBaseMenor.base;
        const costoInicial = precioCompra - precioVenta;
        const costoInicialBear = precioCompraBear - precioVentaBear;
        const puntoMuerto = callBaseMenor.base + costoInicialBear;
        const puntoMuertoBear = callBaseMenor.base + costoInicial;
        const gananciaMaxima = callBaseMayor.base - callBaseMenor.base - costoInicial;
        const gananciaMaximaBear = costoInicialBear * (-1);

        const par: any = {
          callBaseMayor,
          callBaseMenor,
          diferenciaEntreBases,
          puntaje: diferenciaEntreBases !== 0 ? costoInicial / diferenciaEntreBases : 0,
          puntajeBear: 1 + (costoInicialBear / diferenciaEntreBases),
          //puntajeBull: costoInicial / diferenciaEntreBases,
          gananciaPorPesoInvertido: (costoInicial - 1) !== 0 ? diferenciaEntreBases / costoInicial - 1 : 0,
          costoInicial,
          costoInicialBear,
          //puntoMuerto,
          ganancaMaxima: gananciaMaxima,
          ganancaMaximaBear: gananciaMaximaBear,
          precioCompra,
          precioVenta,
          precioCompraBear,
          precioVentaBear,
          //callAComprarBase: callAComprar.base,
          //callALanzarBase: callALanzar.base,
          simboloCompra: callBaseMenor.simbolo,
          simboloVenta: callBaseMayor.simbolo
        };

        // if(par.puntaje > 0.5) {
        pares.push(par);
        paresBear.push(par);
        //}
      }
    }
    //paresBear.sort((x, y) => x.puntajeBear - y.puntajeBear);
    return pares.sort((x, y) => x.puntaje - y.puntaje);
    // vender la que esta OTM
  }


  search() {
    this.currentSubyacenteSubject.next(
      this.form.get('subyacente').value
    );

    this.searchSubject.next();
  }

  getCotizaciones(activoSubyacente: Cotizacion, month: string) {
    /* const cacheOpciones = localStorage.getItem('getOpciones');
    if(cacheOpciones){
      return of(JSON.parse(cacheOpciones));
    } */
    return this.iolService.buscarOpciones('BCBA', activoSubyacente.simbolo).pipe(
      map(opciones => opciones.filter(opcion => this.applyFilters(opcion.simbolo, activoSubyacente, month))),
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

  onWhatsapp(cotizacion: any) {
    this.whatsapp.send("5491140290481", "Hola stocks");
  }

  onOperate(bullData: any, subyacente: Cotizacion) {
    const callVenta: Cotizacion =  bullData.callBaseMayor;
    const callCompra: Cotizacion =  bullData.callBaseMenor;

    this.operateService.setOperation({
      bases: [{
        cotizacion: callCompra,
        operation: 'buy',
        quantity: 0,
        price: bullData.precioCompra,
        estadoActual: 'nueva',
        useMarketValue: true
      }, {
        cotizacion: callVenta,
        operation: 'sell',
        quantity: 0,
        price: bullData.precioVenta,
        estadoActual: 'nueva',
        useMarketValue: true
      }],
      subyacente
    });
  }


  applyFilters(symbol: string, activoSubyacente: Cotizacion, month: string): boolean {
    const belongsToSelectedMonth =  symbol.substr(-2).indexOf(month) !== -1;
    const isCall = symbol.substring(3, 4) === 'C';
    const base = Number(symbol.match(/-?\d*\.?\d+/g));
    const lastPrice = activoSubyacente.ultimoPrecio;
    const moneyOk = Math.abs(base - lastPrice) / lastPrice <= 0.1;
    return belongsToSelectedMonth && isCall && moneyOk;
  }
}
