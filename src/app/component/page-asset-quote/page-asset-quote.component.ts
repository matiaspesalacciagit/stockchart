import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { RestService } from '../../service/rest.service';

import { Titulo, TituloLess, Cotizacion, Opcion, EstadoCuenta, Cuenta, Activo, Puntas, Pais } from '../../model/model';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartService } from 'src/app/service/chart.service';
import { Sort } from '@angular/material';
import { DatePipe } from '@angular/common';
import { string } from '@amcharts/amcharts4/core';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Component({
  selector: 'app-page-asset-quote',
  templateUrl: './page-asset-quote.component.html',
  styleUrls: ['./page-asset-quote.component.css']
})
export class PageAssetQuoteComponent implements OnInit {
  mercado: FormControl;
  fechaDesde: FormControl;
  fechaHasta: FormControl;
  tituloLess: TituloLess;
  pais: FormControl;
  panel: FormControl;
  titulo: FormControl;
  simbolo: FormControl;
  instrumento: FormControl;
  paises: Pais[];
  instrumentos: [];
  paneles: [];
  titulos: [];
  mapTipoEjercicio = null;
  cotizacionActivo: Cotizacion;
  opciones: Opcion[] = [];
  opcionesFiltradas: Cotizacion[] = [];
  activo: string;
  cuentas: Cuenta[];
  activos: Activo[];
  displayedColumnsPortafolio: string[] = ['Activo', 'Cantidad', 'Variación diaria', 'Último Precio', 'PPC', 'Ganancia-Pérdida', 'Saldo Valorizado'];
  activoOperar: FormControl;
  cantidadOperar: FormControl;
  precioOperar: FormControl;
  montoOperar: Number;
  activoOperarCotizacion: Cotizacion;
  displayedColumnsPuntas: string[] = ['Cant Compra', 'Precio Compra', 'Precio Venta', 'Cant Venta'];
  messagesOperatoria: [{message: string}];

  mesActual : string;
  meses : string[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  constructor(private router: Router,  private route: ActivatedRoute, private formBuilder: FormBuilder, private service: RestService, private chartService: ChartService, private datepipe: DatePipe) {   }
  ngOnInit() {
    this.paises = [{ value: 'argentina', desc: 'Argentina'}, { value: 'estados_Unidos',  desc: 'EEUU'}, { value: 'brasil', desc: 'Brasil'}, { value: 'chile', desc: 'Chile'}, { value: 'colombia', desc: 'Colombia'}, { value: 'mexico', desc: 'Mexico'}];
    this.tituloLess = { descripcion : '' , simbolo : '', ultimoPrecio: null, tendencia: '', puntas: [], cantidadOperaciones:null, apertura:null, maximo:null, minimo:null, variacion:null};
    this.cotizacionActivo = <Cotizacion> {apertura: 0, cantidadOperaciones: 0, cierreAnterior: 0, fechaHora: "",  interesesAbiertos: 0, maximo: 0, minimo: 0,  moneda: "", montoOperado: 0, precioAjuste: 0, precioPromedio: 0, tendencia: "", ultimoPrecio: 0, variacion: 0, volumenNominal: 0 }
      let dateFD = new Date(); dateFD.setMonth(dateFD.getMonth()-2);
    this.fechaDesde = new FormControl(dateFD, Validators.required);
    this.fechaHasta = new FormControl(new Date(), Validators.required);
    this.mapTipoEjercicio = new Map<string, string>([ ['Activo>Call', 'itm'], ['Activo<Call', 'otm'], ['Activo>Put', 'otm'], ['Activo<Put', 'itm'] ]);
    this.pais = new FormControl(this.paises[0].value, Validators.required);
    this.instrumento = new FormControl('', Validators.required);
    this.panel = new FormControl('', Validators.required);
    this.mercado = new FormControl('BCBA', Validators.required);
    this.titulo = new FormControl('', Validators.required);
    this.simbolo = new FormControl('GGAL', Validators.required);
    this.activoOperar = new FormControl('');
    this.cantidadOperar = new FormControl('');
    this.precioOperar = new FormControl('');
    this.messagesOperatoria = [{message: ''}];
    this.activoOperarCotizacion = <Cotizacion> { };

    this.changePais(null);
    this.getEstadoCuenta();
    this.getPortafolio();

    this.changeTitulo(any);

    this.mesActual = this.meses[new Date().getMonth()];
  }

  changePais(event:any){
    this.service.buscarInstrumentos(this.pais.value).subscribe(
      result => {
        this.instrumentos = result;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  changeInstrumento(event:any){
    this.service.buscarPaneles(this.pais.value, this.instrumento.value).subscribe(
      result => {
        this.paneles = result;
      }
    );
  }
  changePanel(event:any){
    this.service.buscarActivos(this.instrumento.value, this.panel.value, this.pais.value).subscribe(
      result => {
        this.titulos = result.titulos;
        this.simbolo.value[result.titulos[0].simbolo];
      }
    )
  }

  changeTitulo(event:any){
    this.service.buscarTitulo(this.mercado.value, this.simbolo.value).subscribe(
      data => {
        this.service.obtenerCotizacion(this.mercado.value, this.simbolo.value).subscribe(
          cotizacion => {
            this.tituloLess = <TituloLess> data;
            this.cotizacionActivo = <Cotizacion> cotizacion;
            this.activo = this.tituloLess.simbolo;
        });
      },
      error => {
        console.log("EE:",error);
      });
  }
  
  setActivoWitchChart(opcion: Opcion){
    this.activo = opcion.simbolo;
  }

 
/*
  ITM
    CALL: El Precio del activo (ej. GGAL) > Precio de Ejercicio o Strike (ej. GFGC80.0AB)
    PUT: El Precio del activo (ej. GGAL) < Precio de Ejercicio o Strike (ej. GFGC80.0AB)
  ATM  => no se da mucho
    CALL y PUT  El Precio del activo (ej. GGAL) = Precio de Ejercicio o Strike (ej. GFGC80.0AB)
  OTM
    CALL: El Precio del activo (ej. GGAL) < Precio de Ejercicio o Strike (ej. GFGC80.0AB)
    PUT: El Precio del activo (ej. GGAL) > Precio de Ejercicio o Strike (ej. GFGC80.0AB)
*/

buscarOpciones(tipo: string){
  this.opciones = [];
  this.opcionesFiltradas = [];
  let fd = this.format(this.fechaDesde.value);
  let fh = this.format(this.fechaHasta.value);
  let fecha = null;
  this.service.buscarOpciones(this.mercado.value, this.simbolo.value).subscribe(
    (opciones) => {
      this.opciones = opciones;
        opciones.forEach(element => {
          if(this.aplicarFiltro(element.simbolo, tipo)){
            this.service.obtenerCotizacion(this.mercado.value, element.simbolo).subscribe(
              cotizacion => {
                console.log(element.simbolo) 
                console.log(cotizacion)
                cotizacion.simbolo = element.simbolo;
                cotizacion.puntas = cotizacion.puntas == null || cotizacion.puntas.length == 0 ? [{cantidadCompra: 0, precioCompra: 0, precioVenta: 0, cantidadVenta: 0}] : cotizacion.puntas;
                this.opcionesFiltradas.push(cotizacion);
              }
            )
          } 
      });
    }
  ); 
}

aplicarFiltro(base : string, tipo : string) : boolean {
  let mes = base.split('.')[1];
  let patter =  '/[^0-9.]/g';
  mes = mes.replace(patter, '' );
  mes = mes.substring(1,mes.length);
  // miro si la base es del mes filtrado
  let bolMes = (this.mesActual.toLowerCase().indexOf(mes.toLowerCase()) !== -1)

  // miro la si es call o put
  let tBase =  base.split('.')[0].substring(3,4);
  let bolTipo = tBase == tipo;

  return (bolMes && bolTipo);
}


filtrarCall(){
  this.buscarOpciones("C");
}
filtrarPut(){
  this.buscarOpciones("V");
}
/*        this.service.buscaSerieHistorica(this.mercado.value, element.simbolo, fd, fh, "sinAjustar").subscribe(
            arrayCotizaciones => {
              fecha = null;
              arrayCotizaciones.forEach(cotizacionSec => {
                if (fecha == null) {
                  fecha = Date.parse(cotizacionSec.fechaHora.slice(0,10));
                  element.cotizacion.ultimoPrecio = cotizacionSec.ultimoPrecio;
                  element.cotizacion.montoOperado += cotizacionSec.montoOperado;
                // entro por dia y me guardo el monto operado en ese dia
                }else if(Date.parse(cotizacionSec.fechaHora.slice(0,10)) < fecha){
                  fecha = Date.parse(cotizacionSec.fechaHora.slice(0,10));
                  element.cotizacion.montoOperado += cotizacionSec.montoOperado;
                }
              });
              this.opciones.push(element);*/

buscarSerieHistorica(){ 
  let fd = this.format(this.fechaDesde.value);
  let fh = this.format(this.fechaHasta.value);
  this.service.serieHistorica = [];
  this.service.buscaSerieHistorica(this.mercado.value, this.activo, fd, fh, "sinAjustar").subscribe(
    result => {
      this.service.serieHistorica = result;
      this.chartService.dibujarVelas();
      this.chartService.dibujarVolumen();
    },error => {
      this.service.serieHistorica = [];
      console.log("EE:",error); 
    });
  }

  format(date: Date): string {
    const day = date.getDate();
    const month = ((date.getMonth() + 1)+ "").padStart(2,"0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  graficar(){
    this.buscarSerieHistorica();
  }

  logout(){
    this.service.logout();
    this.router.navigate(['/login']);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortData(sort: Sort) {
    const data = this.opciones.slice();
    if (!sort.active || sort.direction === '') {
      this.opciones = data;
      return;
    }

    this.opciones = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'tipoOpcion': return this.compare(a.tipoOpcion, b.tipoOpcion, isAsc);
        case 'simbolo': return this.compare(a.simbolo, b.simbolo, isAsc);
        case 'descripcion': return this.compare(a.descripcion, b.descripcion, isAsc);
        case 'montoOperado': return this.compare(a.cotizacion.montoOperado, b.cotizacion.montoOperado, isAsc);
        case 'ultimoPrecio' : return this.compare(a.cotizacion.ultimoPrecio, b.cotizacion.ultimoPrecio, isAsc);
        default: return 0;
      }
    });
  }


  getEstadoCuenta(){
    this.service.estadoDeCuenta().subscribe(
      result => { 
        const estadoCuenta = <EstadoCuenta> result;
        this.cuentas = estadoCuenta.cuentas;
      }
    )
  }

  getPortafolio() {
    this.service.portafolio().subscribe(
      result => { 
        this.activos = result['activos'];
      }
    )
  }

  refreshPortafolio(){
    this.getPortafolio();
  }



  buscarCotizacionActivoAOperar(){
    this.service.obtenerCotizacion(this.mercado.value, this.activoOperar.value).subscribe(
      result => {
        this.activoOperarCotizacion = <Cotizacion> result;
        this.precioOperar = new FormControl(this.activoOperarCotizacion.ultimoPrecio);
        this.calcularMonto();
      },error => {
        this.activoOperarCotizacion.puntas = null
        this.activoOperarCotizacion.ultimoPrecio = null;
        this.activoOperarCotizacion.variacion = null;
      });
      
  }

  calcularMonto(){
    this.montoOperar = null;
    if(this.cantidadOperar.value && this.precioOperar.value){
      this.montoOperar = this.cantidadOperar.value * this.precioOperar.value;
    }
  }

  comprar(){
    this.messagesOperatoria = [{message: ''}];
    const validez =this.datepipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    this.service.comprar(this.mercado.value.toUpperCase(), this.activoOperar.value.toUpperCase(), this.cantidadOperar.value, this.precioOperar.value, validez.toString()).subscribe(
      result => {
        let messages = result['messages'];
        if(!messages){
          this.messagesOperatoria.push({message: 'Se ejecuto la orden bajo el numero: ' + result['numeroOperacion'] });
        }else{
          messages.forEach(element => {
          this.messagesOperatoria.push( {message: element['description'] });
          });
        }
      },error => {
        console.log("EE:",error); 
      }
    )
  }


  vender(){
    this.messagesOperatoria = [{message: ''}];
    const validez =this.datepipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    this.service.vender(this.mercado.value.toUpperCase(), this.activoOperar.value.toUpperCase(), this.cantidadOperar.value, this.precioOperar.value, validez.toString()).subscribe(
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



}

/*
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
*/


