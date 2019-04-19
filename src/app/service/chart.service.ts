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

  serieAjustada: Object[] = [];
  constructor(private service: RestService) { }

  normalizarVelas(){
    let fecha = null;
    this.service.serieHistorica.forEach((element, index) => {
        const opcion = <Cotizacion> element;
        if (fecha == null) {
          fecha = Date.parse(opcion.fechaHora.slice(0,10));
          let candle = { "date": opcion.fechaHora.slice(0,10), "close": opcion.ultimoPrecio, "open": opcion.apertura, "low": opcion.minimo, "high": opcion.maximo, "value": opcion.volumenNominal};
          this.serieAjustada.push(candle);
        // entro por dia y me guardo el monto operado en ese dia
        }else if(Date.parse(opcion.fechaHora.slice(0,10)) < fecha){
          fecha = Date.parse(opcion.fechaHora.slice(0,10));
          let candle = { "date": opcion.fechaHora.slice(0,10), "close": opcion.ultimoPrecio, "open": opcion.apertura, "low": opcion.minimo, "high": opcion.maximo, "value": opcion.volumenNominal};
          this.serieAjustada.push(candle);
        }
    });
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
    chart.validateData();
  }
  
  dibujarVolumen(){
    let chart = am4core.create("chartdivvolumen", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.data = this.serieAjustada;

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
    chart.validateData();
  }
}
