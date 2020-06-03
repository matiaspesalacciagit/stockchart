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
    puntas: Puntas[];
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
    puntas: Puntas[];
    tendencia: string;
    ultimoPrecio: number;
    variacion: number;
    volumenNominal: number;
    simbolo: string;
    base: number;
    estado: string;
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




/* Esado de cuenta **/
export interface Saldo {
    liquidacion: string;
    saldo: number;
    comprometido: number;
    disponible: number;
    disponibleOperar: number;
}


export interface Cuenta {
    numero: string;
    tipo: string;
    moneda: string;
    disponible: number;
    comprometido: number;
    saldo: number;
    titulosValorizados: number;
    total: number;
    margenDescubierto: number;
    saldos: Saldo[];
    estado: string;
}

export interface Estadistica {
    descripcion: string;
    cantidad: number;
    volumen: number;
}

export interface EstadoCuenta {
    cuentas: Cuenta[];
    estadisticas: Estadistica[];
    totalEnPesos: number;
}



export interface TituloActivo {
    simbolo: string;
    descripcion: string;
    pais: string;
    mercado: string;
    tipo: string;
    plazo: string;
    moneda: string;
}

export interface Activo {
    cantidad: number;
    comprometido: number;
    puntosVariacion: number;
    variacionDiaria: number;
    ultimoPrecio: number;
    ppc: number;
    gananciaPorcentaje: number;
    gananciaDinero: number;
    valorizado: number;
    titulo: TituloActivo;
}

export interface Pais {
    value: string;
    desc: string;
}

export interface Operacion {
    numero: number;
    fechaOrden: string;
    tipo: string;
    estado: string;
    mercado: string;
    simbolo: string;
    cantidad: number;
    monto: number;
    modalidad: string;
    precio: number;
    fechaOperada: string;
    cantidadOperada: number;
    precioOperado: number;
    montoOperado: number
}