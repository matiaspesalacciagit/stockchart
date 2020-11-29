import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { OperationBase, OperateService, OperationForm } from 'src/app/service/operate.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-form-operation-pair-asset',
  templateUrl: './form-operation-pair-asset.component.html',
  styleUrls: ['./form-operation-pair-asset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormOperationPairAssetComponent implements OnInit, OnDestroy {
  constructor(private operateService: OperateService, private changeDetectionRef: ChangeDetectorRef) {}
  subscriptions: Subscription = new Subscription();

  private bases$: Observable<OperationBase[]> = this.operateService.bases$;
  bases: OperationBase[] = [];
  ngOnInit(): void {
    this.subscriptions.add(
      this.bases$.subscribe(bases => {
        this.bases = bases;
        console.log('bases', bases);
        this.changeDetectionRef.markForCheck();
      })
    );
  }

  onUpdateBase(operationUpdateData: OperationForm) {
    // TODO updatear config de service
    console.log(operationUpdateData);
    //this.operateService.setOperation({this.bases, });
  }

  onOperate() {
    this.operateService.operate();
  }
  onStop() {
    this.operateService.destroy();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
