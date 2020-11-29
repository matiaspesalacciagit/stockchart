import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { OperationBase, OperationForm } from '../../service/operate.service';
import { FormBuilder } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[app-operate-asset]',
  templateUrl: './operate-asset.component.html',
  styleUrls: ['./operate-asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperateAssetComponent {
  constructor(private fb: FormBuilder) {}
  editing: boolean;
  @Input() base: OperationBase;
  @Output() updateBase: EventEmitter<OperationForm> = new EventEmitter<OperationForm>();
  form = this.fb.group({
    quantity: [''],
    price: [''],
    useMarketValue: true
  });

  onSave() {
    this.updateBase.emit(this.form.value);
    this.editing = false;
  }

  edit() {
    this.editing = true;
  }

  cancel() {
    this.editing = false;
  }
}
