import { Component, OnInit, Input } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { Cotizacion } from 'src/app/model/model';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss']
})
export class ResultTableComponent implements OnInit {
  
  @Input() cotizaciones: Cotizacion[];
  @Input() cols: any[];
  @Input() title: String;
  @Input() subTitle: String;
  
  constructor() {    
   }

  ngOnInit(): void {
  }

  //Formatting if the string is a Number
  format(str){
    let value = Number(str);
    console.log(value);
    if (value){   
      let valFloat = parseFloat(str);   
      return valFloat.toFixed(2);
    }
    return str;
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
  }

}
