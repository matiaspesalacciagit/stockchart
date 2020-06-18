import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {
    send(number: string, text: string){
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
    }
}