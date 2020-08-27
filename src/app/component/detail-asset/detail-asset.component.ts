import { Component, OnInit, Input } from '@angular/core';
import { Cotizacion } from 'src/app/model/model';

@Component({
  selector: 'app-detail-asset',
  templateUrl: './detail-asset.component.html',
  styleUrls: ['./detail-asset.component.scss']
})
export class DetailAssetComponent implements OnInit {

  @Input() subyacente: Cotizacion

  constructor() { }

  ngOnInit(): void {
  }

}
