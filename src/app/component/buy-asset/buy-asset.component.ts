import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Cotizacion } from 'src/app/model/model';
import { DatePipe } from '@angular/common';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-buy-asset',
  templateUrl: './buy-asset.component.html',
  styleUrls: ['./buy-asset.component.scss']
})
export class BuyAssetComponent implements OnInit {

  activoOperar: FormControl;
  cantidadOperar: FormControl;
  precioOperar: FormControl;
  montoOperar: Number;
  activoOperarCotizacion: Cotizacion;
  messagesOperatoria: [{message: string}];
  displayedColumnsPuntas: string[] = ['Cant Compra', 'Precio Compra', 'Precio Venta', 'Cant Venta'];

  constructor(private service: RestService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.activoOperar = new FormControl('');
    this.cantidadOperar = new FormControl('');
    this.precioOperar = new FormControl('');
    this.messagesOperatoria = [{message: ''}];
    this.activoOperarCotizacion = <Cotizacion> { };
  }

  buscarCotizacionActivoAOperar(){
    this.service.obtenerCotizacion('BCBA', this.activoOperar.value.toUpperCase()).subscribe(
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
    this.service.comprar('BCBA', this.activoOperar.value.toUpperCase(), this.cantidadOperar.value, this.precioOperar.value, validez.toString(), 't1').subscribe(
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

}
