import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RestService } from '../../service/rest.service';
import { HttpErrorResponse } from '@angular/common/http';

import { Titulo, TituloLess, Opciones} from '../../model/model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-asset-quote',
  templateUrl: './page-asset-quote.component.html',
  styleUrls: ['./page-asset-quote.component.css']
})
export class PageAssetQuoteComponent implements OnInit {
  form: FormGroup;
  mercado: FormControl;
  tipoOpcion: FormControl
  opciones: Object[] = [];
  serieHistorica: Object[] = [];
  serieAjustada: Object[] = [];
  opcionSelected: string;
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
  opcionCall = true;
  opcionPut = false;
  constructor(private router: Router,  private route: ActivatedRoute, private formBuilder: FormBuilder, private service: RestService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      paneles : [[], Validators.required],
      instrumentos : [[], Validators.required],
      titulos : [[], Validators.required],
      opcionSelected : [''],
      opciones : [[]],
      
    });
    this.tituloLess = { descripcion : '' , simbolo : '', ultimoPrecio: null, tendencia: '', puntas: [], cantidadOperaciones:null, apertura:null, maximo:null, minimo:null, variacion:null};
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
    this.tipoOpcion = new FormControl('');
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
      titulo => {
        this.service.obtenerCotizacion(this.mercado.value, this.simbolo.value).subscribe(
          cotizacion => {
            this.tituloLess = <TituloLess> titulo;
            this.tituloLess.ultimoPrecio = cotizacion.ultimoPrecio;
        });
      },
      error => {
        console.log("EE:",error);
      });
  }
  
  changeTipoOpcion(event:any){
    //if(this.tipoOpcion.value!="") {
      this.service.buscarOpciones(this.mercado.value, this.simbolo.value).subscribe(
        (data) => {
            let ultimoPrecio = this.tituloLess.ultimoPrecio;
            let filtradas: Array<Opciones> = [];
            data.forEach(element => {
              if(element.tipoOpcion == this.tipoOpcion.value){
                let thenum = element.simbolo.replace(/[^\d\.]*/g, '');
                let key = (ultimoPrecio>thenum ? 'Activo>'+element.tipoOpcion : ultimoPrecio<thenum ? 'Activo<'+element.tipoOpcion : '' );
                element.tipoEjercicio = this.mapTipoEjercicio.get(key);
                filtradas.push(element);
              }
              this.opciones = filtradas;
            }
          )
        },
        (err: Object) => {
          if (err instanceof Error) {
            console.log('Client-side error occured.');
          } else if (err instanceof HttpErrorResponse) {
            const msjerror = err.error['error_descript'];
            console.log(msjerror);
          } else {

          }
        }
      );
    //} 
  }
  
  logout(){
    this.service.logout();
    this.router.navigate(['/login']);
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
  
buscarOpciones(){
  this.service.buscarOpciones(this.mercado.value, this.simbolo.value).subscribe(
    (data) => {
        let ultimoPrecio = this.tituloLess.ultimoPrecio;
        let filtradas: Array<Opciones> = [];
        data.forEach(element => {
          if(element.tipoOpcion == this.tipoOpcion.value){
            let thenum = element.simbolo.replace(/[^\d\.]*/g, '');
            let key = (ultimoPrecio>thenum ? 'Activo>'+element.tipoOpcion : ultimoPrecio<thenum ? 'Activo<'+element.tipoOpcion : '' );
            element.tipoEjercicio = this.mapTipoEjercicio.get(key);
            filtradas.push(element);
          }
          this.opciones = filtradas;
        }
      )
    },
    (err: Object) => {
      if (err instanceof Error) {
        console.log('Client-side error occured.');
      } else if (err instanceof HttpErrorResponse) {
        const msjerror = err.error['error_descript'];
        console.log(msjerror);
      }else{

      }
    }
  ); 
}
  
buscarSerieHistorica(){ 
  let fd = this.format(this.fechaDesde.value);
  let fh = this.format(this.fechaHasta.value);
  let activo = this.simbolo.value;
  if(this.opcionSelected != null){
    activo = this.opcionSelected;
  }
  this.service.buscaSerieHistorica(this.mercado.value, activo, fd, fh, "sinAjustar").subscribe(
    result => {
      this.service.serieHistorica = result;
      this.router.navigate(['detail'], { relativeTo: this.route });
    },error => {
      this.service.serieHistorica = [];
      console.log("EE:",error); 
    });
  }


  showChart(){
    this.router.navigate(['chart'], { relativeTo: this.route });
  }

  showDetail(){
    this.router.navigate(['detail'], { relativeTo: this.route });
  }
  format(date: Date): string {
    const day = date.getDate();
    const month = ((date.getMonth() + 1)+ "").padStart(2,"0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  
}
