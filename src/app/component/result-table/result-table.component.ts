import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { Cotizacion } from 'src/app/model/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultTableComponent implements OnInit {
  @Input() cotizaciones: Cotizacion[];
  @Input() cols: any[];
  @Input() title: string;
  @Input() subTitle: string;
  @Input() sortField: string;

  @Output() whatsapp: EventEmitter<Cotizacion> = new EventEmitter<Cotizacion>();
  @Output() operate: EventEmitter<Cotizacion> = new EventEmitter<Cotizacion>();

  constructor(private router: Router ) {}

  ngOnInit(): void {}

  //Formatting if the string is ao Number
  format(str) {
    const value = Number(str);
    if (value) {
      return parseFloat(str).toFixed(3);
    }
    return str;
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null){
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }
      return event.order * result;
    });
  }

  onWhatsApp(cotizacion: Cotizacion) {
    this.whatsapp.emit(cotizacion);
  }

  onOperate(cotizacion: Cotizacion) {
    this.operate.emit(cotizacion);
    this.router.navigate(['/operation', { }]);
  }
}
