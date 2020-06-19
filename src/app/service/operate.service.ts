import { Injectable } from '@angular/core';
import { Cotizacion } from '../model/model';
import { RestService } from '../service/rest.service';
import { interval, BehaviorSubject, Subscription,combineLatest  } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

export interface OperationBase {
    operation: 'buy'|'sell',
    cotizacion: Cotizacion,
    amount: number,
    price: string,
}

export interface Operation {
    subyacente: Cotizacion,
    bases: OperationBase[]    
}

@Injectable()
export class OperateService {
    constructor(private iolService: RestService, private datePipe: DatePipe) {}

    subyacente$ = new BehaviorSubject<Cotizacion>(null);
    bases$ = new BehaviorSubject<OperationBase[]>(null);

    subscriptions: Subscription = new Subscription();

    setOperation({bases, subyacente}: Operation) {
        this.destroy();
        this.startSubyacente(subyacente);
        this.startBases(bases);
        // this.startSubyacente({...this.subyacente$.value, ...subyacente});
        // this.startBases({...this.bases$.value, ...bases});
    }

    destroy(){
        this.subscriptions.unsubscribe();
    }


    async operate() {
        const bases = [...this.bases$.value];
        const buys = bases.filter(x=>x.operation === 'buy');
        const sells = bases.filter(x=>x.operation === 'sell');



    }
/*
    comprar(operationBase: OperationBase){
        const messagesOperatoria = [{message: ''}];
        const validez =this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        this.iolService.comprar('BCBA', operationBase.cotizacion.simbolo.toUpperCase(), this.cantidadOperar.value, this.precioOperar.value, validez.toString(), 't1').subscribe(
          result => {
            let messages = result['messages'];
            if(!messages){
              this.messagesOperatoria.push({message: 'Se ejecuto la orden bajo el numero: ' + result['numeroOperacion'] });
            }else{
              messages.forEach(element => {
              messagesOperatoria.push( {message: element['description'] });
              });
            }
          },error => {
            console.log("EE:",error); 
          }
        )
      }
    
    
      vender(){
        this.messagesOperatoria = [{message: ''}];
        const validez =this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        this.service.vender('BCBA', this.activoOperar.value.toUpperCase(), this.cantidadOperar.value, this.precioOperar.value, validez.toString(), 't1').subscribe(
          result => {
            if(!result){
              this.messagesOperatoria.push({message: 'Se ejecuto la orden bajo el numero: ' + result['numeroOperacion'] });
            }else{
              let desc: any = result;
              desc.forEach(element => {
                this.messagesOperatoria.push( {message: element['description'] });
              });
            }
          },error => {
            console.log("EE:",error); 
          }
        )
      }
*/
    private startSubyacente(subyacente: Cotizacion) {            
        this.subscriptions.add(interval(20000).pipe(
            startWith(subyacente),
            switchMap(() => this.iolService.obtenerCotizacion('BCBA', subyacente.simbolo))
        ).subscribe(this.subyacente$));
    }

    private startBases(bases: OperationBase[]) {
        this.subscriptions.add(interval(20000).pipe(
            startWith(bases),
            switchMap(() => {
                const apiCalls = bases.map((element) =>
                    this.iolService.obtenerCotizacion('BCBA', element.cotizacion.simbolo).pipe(
                        map(cotizacion => ({...element, cotizacion }) )
                    )
                );
                return combineLatest(apiCalls);
            })
        ).subscribe(this.bases$));
    }
}


/*
    Formularios -> carga datos

    Servicio ->
        // Muestra en pantalla un cuadro para operar.
        
        abrirBull(Conditions);
        updateConditions(Conditions) {}
        
        ejecutarOperacion(Conditions) {}

        cancelar() {}

        estadoDeLasBases$: {
            puntasBase1$,
            puntasBase2$,
            precioSubyecente$
        };

        estadoOperatoria$: cargado, operado, cancelado, etc...                 
        destroy(){}   
    }
*/