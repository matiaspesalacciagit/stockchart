import { Component, OnInit } from '@angular/core';
import { OperationBase, OperateService, OperationForm } from 'src/app/service/operate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-operation-pair-asset',
  templateUrl: './form-operation-pair-asset.component.html',
  styleUrls: ['./form-operation-pair-asset.component.scss']
})
export class FormOperationPairAssetComponent implements OnInit {
  constructor(private operateService: OperateService) { }

  bases$: Observable<OperationBase[]> = this.operateService.bases$;

  ngOnInit(): void {
  }

  onUpdateBase(operationUpdateData: OperationForm) {
   // TODO updatear config de service
    // this.operateService.setOperation();
  }

  onOperate() {
    this.operateService.operate();
  }
  onStop() {
    this.operateService.destroy();
  }

}
