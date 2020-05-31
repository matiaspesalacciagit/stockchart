import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DateService {
    months$ = of([
        // {label: 'Enero', value: 'EN'},
        {label: 'Febrero', value: 'FE'},
        // {label: 'Marzo', value: "MA"},
        {label: 'Abril', value: 'AB'},
        // {label: 'Mayo', value: 'MY'}, 
        {label: 'Junio', value: 'JU'},
        // {label: 'Julio', value: 'JL'},
        {label: 'Agosto', value: 'AG'},
        // {label: 'Septiembre', value: 'SE'},
        {label: 'Octubre', value: 'OC'},
        // {label: 'Noviembre', value: 'NO'},
        {label: 'Diciembre', value: 'DI'}  
    ]);
}
