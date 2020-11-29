import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cotizacion, Opcion, Puntas } from 'src/app/model/model';
import { BullSpreadFormData } from '../model/bull-spread-form-data';
import { Par } from '../model/bull-spread-pair';
import { DateService } from './date.service';
import { OperateService } from './operate.service';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class BullSpreadService {
  constructor(private iolService: RestService, private dateService: DateService) {}

  bullSpreadFormData$: BehaviorSubject<BullSpreadFormData> = new BehaviorSubject<BullSpreadFormData>(null);

  bullSpreadPairsData$: BehaviorSubject<Par[]> = new BehaviorSubject<Par[]>([]);
  bullSpreadSubyacenteData$: BehaviorSubject<Cotizacion> = new BehaviorSubject<Cotizacion>(null);

  setBullSpreadFormData(bullSpreadFormData: BullSpreadFormData) {
    this.bullSpreadFormData$.next(bullSpreadFormData);
  }

  async getOnce() {
    this.bullSpreadPairsData$.next([]);
    this.bullSpreadSubyacenteData$.next(null);
    const subyacentePrice = await this.iolService.getPrice('BCBA', this.bullSpreadFormData$.value.subyacenteTicker).toPromise();
    this.bullSpreadSubyacenteData$.next(subyacentePrice);
    const prices = await this.getOptionsData(subyacentePrice, this.bullSpreadFormData$.value.monthCode);
    const datas = this.getBullData(prices);
    this.bullSpreadPairsData$.next(datas);
  }

  private async getOptionsData(activoSubyacente: Cotizacion, month: string) {
    let opciones = await this.iolService.buscarOpciones('BCBA', activoSubyacente.simbolo).toPromise();

    opciones = opciones.filter(opcion => this.applyFilters(opcion, opcion.simbolo, activoSubyacente, month));
    const apiCalls = opciones.map(element =>
      this.iolService.obtenerCotizacion('BCBA', element.simbolo).pipe(
        map(opcion => ({
          ...opcion,
          base: Number(element.descripcion.match(/^(Call|Put) ([A-Z]{4}) ([0-9.]+) Vencimiento: (\d{2})\/(\d{2})\/(\d{4})$/)[3])
        }))
      )
    );

    const result = await combineLatest(apiCalls).toPromise();
    return result;
  }

  private applyFilters(opcion: Opcion, symbol: string, activoSubyacente: Cotizacion, month: string): boolean {
    // TODO El servicio debe proveer las respuestas ya masticadas
    const decriptionMatches = opcion.descripcion.match(/^(Call|Put) ([A-Z]{4}) ([0-9.]+) Vencimiento: (\d{2})\/(\d{2})\/(\d{4})$/);
    if (!decriptionMatches) {
      throw new Error('El formato de IOL cambió');
    }
    const base = Number(decriptionMatches[3]);

    // TODO refector
    const belongsToSelectedMonth = decriptionMatches[5] === this.dateService.months.find(x => x.value === month).number;

    const isCall = opcion.tipoOpcion === 'Call';
    const lastPrice = activoSubyacente.ultimoPrecio;
    const moneyOk = Math.abs(base - lastPrice) / lastPrice <= 0.1;
    return belongsToSelectedMonth && isCall && moneyOk;
  }

  private getBullData(cotizaciones: Cotizacion[]): Par[] {
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
        const gananciaMaximaBear = costoInicialBear * -1;
        const par: Par = {
          callBaseMayor,
          callBaseMenor,
          diferenciaEntreBases,
          puntaje: diferenciaEntreBases !== 0 ? costoInicial / diferenciaEntreBases : 0,
          puntajeBear: 1 + costoInicialBear / diferenciaEntreBases,
          //puntajeBull: costoInicial / diferenciaEntreBases,
          gananciaPorPesoInvertido: costoInicial - 1 !== 0 ? diferenciaEntreBases / costoInicial - 1 : 0,
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

  private getVentaReal(puntas: Puntas[], lote: number) {
    for (const punta of puntas) {
      lote -= punta.cantidadCompra;
      if (lote <= 0) {
        return punta.precioCompra;
      }
    }
    return null;
  }

  private getCompraReal(puntas: Puntas[], lote: number) {
    for (const punta of puntas) {
      lote -= punta.cantidadVenta;
      if (lote <= 0) {
        return punta.precioVenta;
      }
    }
    return null;
  }
}
