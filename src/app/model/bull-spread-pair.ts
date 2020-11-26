import { Cotizacion } from './model';

export interface Par {
    callBaseMayor: Cotizacion;
    callBaseMenor: Cotizacion;
    diferenciaEntreBases: number;
    puntaje: number;
    puntajeBear: number;
    gananciaPorPesoInvertido: number;
    costoInicial: number;
    costoInicialBear: number;
    ganancaMaxima: number;
    ganancaMaximaBear: number;
    precioCompra: number;
    precioVenta: number;
    precioCompraBear: number;
    precioVentaBear: number;
    simboloCompra: string;
    simboloVenta: string;
  }