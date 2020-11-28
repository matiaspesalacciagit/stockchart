import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  months = [
    { value: 'FE', number: '2', label: 'Febrero' },
    { value: 'AB', number: '4', label: 'Abril' },
    { value: 'JU', number: '6', label: 'Junio' },
    { value: 'AG', number: '8', label: 'Agosto' },
    { value: 'OC', number: '10', label: 'Octubre' },
    { value: 'DI', number: '12', label: 'Diciembre' }
  ];
}
