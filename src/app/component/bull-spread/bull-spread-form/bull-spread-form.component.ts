import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BullSpreadFormData } from 'src/app/model/bull-spread-form-data';
import { DateService } from 'src/app/service/date.service';

@Component({
  selector: 'app-bull-spread-form',
  templateUrl: './bull-spread-form.component.html',
  styleUrls: ['./bull-spread-form.component.scss']
})
export class BullSpreadFormComponent implements OnInit {

  constructor(    
    private fb: FormBuilder,
    public dateService: DateService,
  ) { }

  ngOnInit(): void {
  }

  @Output() search: EventEmitter<BullSpreadFormData> = new EventEmitter<BullSpreadFormData>()

  form = this.fb.group({
    subyacente: ['GGAL'],
    month: ['DI'],
    loteOperar: ['10'],
    autorefresh: [false],
  });

  onSearch() {
    const data: BullSpreadFormData = {
      lotesQuantity: this.form.get('loteOperar').value,
      monthCode: this.form.get('month').value,
      subyacenteTicker: this.form.get('subyacente').value 
    };
    this.search.emit(data);
  }

  
}
