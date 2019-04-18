import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RestService } from '../../service/rest.service';

import { Titulo, TituloLess, Cotizacion, Opcion } from '../../model/model';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartService } from 'src/app/service/chart.service';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-page-asset-quote',
  templateUrl: './page-asset-quote.component.html',
  styleUrls: ['./page-asset-quote.component.css']
})
export class PageAssetQuoteComponent implements OnInit {
  form: FormGroup;
  mercado: FormControl;
  fechaDesde: FormControl;
  fechaHasta: FormControl;
  tituloLess: TituloLess;
  pais: FormControl;
  panel: FormControl;
  titulo: FormControl;
  simbolo: FormControl;
  instrumento: FormControl;
  instrumentos: [];
  paneles: [];
  titulos: Titulo[];
  mapTipoEjercicio = null;
  cotizacionActivo: Cotizacion;
  opciones: Opcion[] = [];

  activo: string;

  constructor(private router: Router,  private route: ActivatedRoute, private formBuilder: FormBuilder, private service: RestService, private chartService: ChartService) {   }
  ngOnInit() {
    this.form = this.formBuilder.group({
      paneles : [[], Validators.required],
      instrumentos : [[], Validators.required],
      titulos : [[], Validators.required],
    
    });
    this.tituloLess = { descripcion : '' , simbolo : '', ultimoPrecio: null, tendencia: '', puntas: [], cantidadOperaciones:null, apertura:null, maximo:null, minimo:null, variacion:null};
    this.cotizacionActivo = <Cotizacion> {apertura: 0, cantidadOperaciones: 0, cierreAnterior: 0, fechaHora: "",  interesesAbiertos: 0, maximo: 0, minimo: 0,  moneda: "", montoOperado: 0, precioAjuste: 0, precioPromedio: 0, puntas: "", tendencia: "", ultimoPrecio: 0, variacion: 0, volumenNominal: 0 }
    let dateFD = new Date(); dateFD.setMonth(dateFD.getMonth()-2);
    this.fechaDesde = new FormControl(dateFD, Validators.required);
    this.fechaHasta = new FormControl(new Date(), Validators.required);
    this.mapTipoEjercicio = new Map<string, string>([ ['Activo>Call', 'itm'], ['Activo<Call', 'otm'], ['Activo>Put', 'otm'], ['Activo<Put', 'itm'] ]);
    this.pais = new FormControl('', Validators.required);
    this.instrumento = new FormControl('', Validators.required);
    this.panel = new FormControl('', Validators.required);
    this.mercado = new FormControl('BCBA', Validators.required);
    this.titulo = new FormControl('', Validators.required);
    this.simbolo = new FormControl('', Validators.required);
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
           // this.buscarSerieHistorica();
        });
      },
      error => {
        console.log("EE:",error);
      });


  }
  
  // changeTipoOpcion(event:any){
  //     this.service.buscarOpciones(this.mercado.value, this.simbolo.value).subscribe(
  //       (data) => {
  //           let ultimoPrecio = this.tituloLess.ultimoPrecio;
  //           let filtradas: Array<Opciones> = [];
  //           data.forEach(element => {
  //             if(element.tipoOpcion == this.tipoOpcion.value){
  //               let thenum = element.simbolo.replace(/[^\d\.]*/g, '');
  //               let key = (ultimoPrecio>thenum ? 'Activo>'+element.tipoOpcion : ultimoPrecio<thenum ? 'Activo<'+element.tipoOpcion : '' );
  //               element.tipoEjercicio = this.mapTipoEjercicio.get(key);
  //               filtradas.push(element);
  //             }
  //             this.opciones = filtradas;
  //           }
  //         )
  //       },
  //       (err: Object) => {
  //         if (err instanceof Error) {
  //           console.log('Client-side error occured.');
  //         } else if (err instanceof HttpErrorResponse) {
  //           const msjerror = err.error['error_descript'];
  //           console.log(msjerror);
  //         } else {

  //         }
  //       }
  //     );
  //   }
  

 
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
  
buscarOpciones(){
  this.opciones = [];
  let fd = this.format(this.fechaDesde.value);
  let fh = this.format(this.fechaHasta.value);
  let sumMonto = 0;
  this.service.buscarOpciones(this.mercado.value, this.simbolo.value).subscribe(
    (opciones) => {
        opciones.forEach(element => {
          this.service.buscaSerieHistorica(this.mercado.value, element.simbolo, fd, fh, "sinAjustar").subscribe(
            arrayCotizaciones => {
              sumMonto = 0;
              arrayCotizaciones.forEach(cotizacionSec => {
                sumMonto += cotizacionSec.montoOperado;
              });
              element.cotizacion.montoOperado = sumMonto;
              this.opciones.push(element);
        });
      });
    }
  ); 
}



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

  sortData(sort: Sort) {
    const data = this.opciones.slice();
    if (!sort.active || sort.direction === '') {
      this.opciones = data;
      return;
    }

    this.opciones = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'tipoOpcion': return compare(a.tipoOpcion, b.tipoOpcion, isAsc);
        case 'simbolo': return compare(a.simbolo, b.simbolo, isAsc);
        case 'descripcion': return compare(a.descripcion, b.descripcion, isAsc);
        case 'montoOperado': return compare(a.cotizacion.montoOperado, b.cotizacion.montoOperado, isAsc);
        default: return 0;
      }
    });
  }
}



function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}