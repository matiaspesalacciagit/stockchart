import { Component } from '@angular/core';
import { BullSpreadFormData } from 'src/app/model/bull-spread-form-data';
import { BullSpreadService } from 'src/app/service/bull-spread.service';
import { OperateService } from 'src/app/service/operate.service';
import { WhatsAppService } from 'src/app/service/whats-app.service';
import { Cotizacion } from 'src/app/model/model';
import { Par } from 'src/app/model/bull-spread-pair';

@Component({
  selector: 'app-bull-spread',
  templateUrl: './bull-spread.component.html',
  styleUrls: ['./bull-spread.component.scss']
})
export class BullSpreadComponent {
  constructor(private whatsapp: WhatsAppService, private operateService: OperateService, private bullSpreadService: BullSpreadService) {}

  bullSpreadPairsData$ = this.bullSpreadService.bullSpreadPairsData$;
  bullSpreadSubyacenteData$ = this.bullSpreadService.bullSpreadSubyacenteData$;
  bullSpreadFormData$ = this.bullSpreadService.bullSpreadFormData$;

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

  onSearch(bullSpreadFormData: BullSpreadFormData) {
    this.bullSpreadService.setBullSpreadFormData(bullSpreadFormData);
    this.bullSpreadService.getOnce();
  }

  onWhatsapp(cotizacion: any) {
    this.whatsapp.send('5491140290481', 'Hola stocks');
  }

  async onOperate(bullData: Par, subyacente: Cotizacion) {
    const callVenta: Cotizacion = bullData.callBaseMayor;
    const callCompra: Cotizacion = bullData.callBaseMenor;

    this.operateService.setOperation({
      bases: [
        {
          cotizacion: callCompra,
          operation: 'buy',
          quantity: this.bullSpreadFormData$.value.lotesQuantity,
          price: String(bullData.precioCompra),
          estadoActual: 'nueva',
          useMarketValue: true
        },
        {
          cotizacion: callVenta,
          operation: 'sell',
          quantity: this.bullSpreadFormData$.value.lotesQuantity,
          price: String(bullData.precioVenta),
          estadoActual: 'nueva',
          useMarketValue: true
        }
      ],
      subyacente
    });
  }
}
