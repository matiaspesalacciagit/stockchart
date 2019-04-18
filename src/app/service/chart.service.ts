import { Injectable } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Candle, Cotizacion } from '../model/model';
import { RestService } from './rest.service';

//am4core.useTheme(am4themes_animated);

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  serieAjustada: Candle[] = [];
  constructor(private service: RestService) { }


  
  normalizarVelas(){
    let candle : Candle;
    this.service.serieHistorica.forEach((element, index) => {
        const opcion = <Cotizacion> element;
        if(index == 0){
          candle = this.initializeCandle(opcion);
        }else if( candle.date.slice(0,10) === opcion.fechaHora.slice(0,10)){
          if(new Date(candle.date).getTime() > new Date(opcion.fechaHora).getTime()){
            candle.open = opcion.apertura.toString();
            if(candle.lowNumber > opcion.minimo){
              candle.lowNumber = opcion.minimo;
              candle.low = opcion.minimo.toString();
            }
            if(candle.highNumber < opcion.maximo){
              candle.highNumber = opcion.maximo;
              candle.high = opcion.maximo.toString();
            }
          }
          candle.montoOperado += opcion.montoOperado;
          candle.volumenNominal += opcion.volumenNominal;
          candle.cantidadOperaciones += opcion.cantidadOperaciones;
          candle.close = opcion.ultimoPrecio.toString();
          //const variacion = (((opcion.ultimoPrecio / opcion.cierreAnterior) *100 ) -100).toFixed(2).toString();
          //candle.variation = new Number(variacion).toString();
        }else{
          candle.date = candle.date.slice(0,10).toString();
          candle.montoOperado = new Number(candle.montoOperado.toFixed(2)).valueOf();
          this.serieAjustada.push(candle);
          candle = this.initializeCandle(opcion);
        }
    });
  }

  initializeCandle(opcion: Cotizacion): Candle {
    let candle: Candle = {date: "", open: "", high: "", highNumber: 0, low: "", lowNumber: 0, close: "", variation: "", montoOperado: 0, volumenNominal: 0, cantidadOperaciones: 0}
    candle.date = opcion.fechaHora.toString() ;
    candle.close = opcion.cierreAnterior.toString();
    candle.open = opcion.apertura.toString();
    candle.high = opcion.maximo.toString();
    candle.low = opcion.minimo.toString();
    candle.highNumber = opcion.maximo;
    candle.lowNumber = opcion.minimo;
    candle.montoOperado = opcion.montoOperado;
    candle.volumenNominal = opcion.volumenNominal;
    candle.cantidadOperaciones = opcion.cantidadOperaciones;
    return candle;
  }

  dibujarVelas() {
    this.normalizarVelas();
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    var series = chart.series.push(new am4charts.CandlestickSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "close";
    series.dataFields.openValueY = "open";
    series.dataFields.lowValueY = "low";
    series.dataFields.highValueY = "high";
    series.simplifiedProcessing = true;
    //series.tooltipText = "Open: [bold]${openValueY.value}[/]\nLow: [bold]${lowValueY.value}[/]\nHigh: [bold]${highValueY.value}[/]\nClose: [bold]${valueY.value}[/]";
    series.tooltipText = "Open:${openValueY.value}\nLow:${lowValueY.value}\nHigh:${highValueY.value}\nClose:${valueY.value}";
    chart.cursor = new am4charts.XYCursor();
    chart.data = this.serieAjustada;
    //chart.validateData();
  }
  
  dibujarVolumen(){
    let chart = am4core.create("chartdivvolumen", am4charts.XYChart);
    chart.paddingRight = 20;

    this.serieAjustada.forEach(element => {
      let o = element as Candle;
      chart.data.push({ date: o.date, value: o.volumenNominal});
    });

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.strokeWidth = 2
    series.strokeOpacity = 0.3;
    series.tooltipText = "Volumen Nominal: [bold]{valueY}[/]";
    series.fillOpacity = 0.3;
    
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.opacity = 0;
    //chart.validateData();
  }
}
