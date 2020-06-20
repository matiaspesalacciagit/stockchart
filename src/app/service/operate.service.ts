import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Subscription } from 'rxjs';
import { filter, map, startWith, switchMap, takeWhile } from 'rxjs/operators';
import { Cotizacion } from '../model/model';
import { RestIolService } from './rest-iol.service';

//TODO : Mover a otro lugar!
export interface OperationForm {
  quantity: number;
  price: number;
  useMarketValue: boolean;
}

export interface OperationBase {
  operation: 'buy' | 'sell';
  cotizacion: Cotizacion;
  quantity: number;
  price: string;
  numeroOperacion?: number;
  estadoActual?: string;
  useMarketValue: boolean;
}

export interface Operation {
  subyacente: Cotizacion;
  bases: OperationBase[];
}

@Injectable({
  providedIn: 'root'
})
export class OperateService {
  constructor(private iolService: RestIolService, private datePipe: DatePipe) {}

  subyacente$ = new BehaviorSubject<Cotizacion>(null);
  bases$ = new BehaviorSubject<OperationBase[]>(null);

  subscriptions: Subscription = new Subscription();

  setOperation({ bases, subyacente }: Operation) {
    this.destroy();
    this.startSubyacente(subyacente);
    this.startBases(bases);
    // this.startSubyacente({...this.subyacente$.value, ...subyacente});
    // this.startBases({...this.bases$.value, ...bases});
  }

  destroy() {
    this.subscriptions.unsubscribe();
  }

  async operate() {
    const bases = [...this.bases$.value];
    try {
      for (const base of bases) {
        if (base.operation === 'buy') {
          const response = await this.createBuyOrder(base).toPromise();
          base.numeroOperacion = response.numeroOperacion;
        } else if (base.operation === 'sell') {
          const response = await this.createSellOrder(base).toPromise();
          base.numeroOperacion = response.numeroOperacion;
        }
        this.bases$.next(bases);
        await this.startCheckingOrder(base.numeroOperacion).toPromise();
        base.estadoActual = 'terminada';
      }
    } catch (error) {
      alert(error.messages[0].title + ` ` + error.messages[0].description);
      console.error(error);
    }
  }

  // TODO poner este codigo dentro del comprar de iolService
  private createBuyOrder(operationBase: OperationBase) {
    const validez = this.datePipe.transform(new Date(), `yyyy-MM-dd'T'HH:mm:ss.SSSZ`);
    return this.iolService
      .comprar('BCBA',
        operationBase.cotizacion.simbolo.toUpperCase(),
        String(operationBase.quantity), operationBase.price, validez.toString(), 't1'
      );
  }

  // TODO poner este codigo dentro del vender de iolService
  private createSellOrder(operationBase: OperationBase) {
    //  const messagesOperatoria = [{ message: '' }];
    const validez = this.datePipe.transform(new Date(), `yyyy-MM-dd'T'HH:mm:ss.SSSZ`);
    return this.iolService
      .vender('BCBA',
        operationBase.cotizacion.simbolo.toUpperCase(),
        String(operationBase.quantity), operationBase.price, validez.toString(), 't1'
      );
  }

  private startCheckingOrder(numeroOperacion) {
    return interval(10000).pipe(
      startWith(-1),
      switchMap(() => this.iolService.operaciones(numeroOperacion)),
      takeWhile(operacion => operacion.estadoActual !== 'terminada' ),
      filter(operacion => operacion.estadoActual === 'terminada')
    );
  }

  private startSubyacente(subyacente: Cotizacion) {
    this.subscriptions.add(
      interval(20000)
        .pipe(
          startWith(subyacente),
          switchMap(() => this.iolService.obtenerCotizacion('BCBA', subyacente.simbolo))
        )
        .subscribe(this.subyacente$)
    );
  }

  private startBases(bases: OperationBase[]) {
    this.subscriptions.add(
      interval(20000)
        .pipe(
          startWith(bases),
          switchMap(() => {
            const apiCalls = bases.map(element =>
              this.iolService.obtenerCotizacion('BCBA', element.cotizacion.simbolo).pipe(map(cotizacion => ({ ...element, cotizacion })))
            );
            return combineLatest(apiCalls);
          })
        )
        .subscribe(this.bases$)
    );
  }
}
