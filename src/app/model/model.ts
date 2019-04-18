export interface TituloLess{
    simbolo: string;
    descripcion: string;
    ultimoPrecio: number;
    tendencia: string;
    puntas: Puntas[];
    cantidadOperaciones: number;
    variacion: number;
    apertura: number;
    maximo: number;
    minimo: number
}


export interface Puntas {
    cantidadCompra: number;
    precioCompra: number;
    precioVenta: number;
    cantidadVenta: number;
}

export interface Titulo {
    simbolo: string;
    puntas: Puntas;
    ultimoPrecio: number;
    variacionPorcentual: number;
    apertura: number;
    maximo: number;
    minimo: number;
    ultimoCierre: number;
    volumen: number;
    cantidadOperaciones: number;
    fecha: Date;
    tipoOpcion?: any;
    precioEjercicio?: any;
    fechaVencimiento?: any;
    mercado: string;
    moneda: string;
    tipoEjercicio: string;
}


export interface Cotizacion {
    apertura: number;
    cantidadOperaciones: number;
    cierreAnterior: number;
    fechaHora: string;
    interesesAbiertos: number;
    maximo: number;
    minimo: number;
    moneda: string
    montoOperado: number;
    precioAjuste: number;
    precioPromedio: number;
    puntas: string
    tendencia: string;
    ultimoPrecio: number;
    variacion: number;
    volumenNominal: number;
}

export interface PanelCotizacion{
    instrumento : string;
    panel: string;
    pais: string;
}

export interface Opcion{

    cotizacion: Cotizacion;
    simboloSubyacente: string;
    fechaVencimiento: string;
    tipoOpcion: string;
    simbolo: string;
    descripcion: string;
    pais: string;
    mercado: string;
    tipo: string;
    plazo: string;
    moneda: string;
}

export interface TokenIOL {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    issued: string;
    expires: string;
    refreshexpires: string;
}

export interface Candle{
    date: string;
    open: string;
    high: string;
    highNumber: number
    low: string;
    lowNumber: number;
    close: string;
    variation: string;
    montoOperado: number;
    volumenNominal: number;
    cantidadOperaciones: number;

}
