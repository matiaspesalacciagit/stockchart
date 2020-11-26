import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DateService {
    months = [
        {label: 'Febrero', value: 'FE'},
        {label: 'Abril', value: 'AB'},
        {label: 'Junio', value: 'JU'},
        {label: 'Agosto', value: 'AG'},
        {label: 'Octubre', value: 'OC'},
        {label: 'Diciembre', value: 'DI'}  
    ];
}
