import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { OperationBase, OperationForm } from 'src/app/service/operate.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: '[app-operate-asset]',
  templateUrl: './operate-asset.component.html',
  styleUrls: ['./operate-asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperateAssetComponent  {
  constructor(private fb: FormBuilder) {}
  editing: boolean;
  @Input() base: OperationBase;
  @Output() updateBase = new EventEmitter<OperationForm>();
  form = this.fb.group({
    quantity: [''],
    price: [''],
    useMarketValue: [false]
  });

  onSave() {
    this.updateBase.emit(this.form.value);
    this.editing = false;
  }
}
