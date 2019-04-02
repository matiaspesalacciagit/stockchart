import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot } from '@angular/router';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService  implements CanActivate {

  state: RouterStateSnapshot;
  constructor(private router: Router,private service: RestService) {}
  
  canActivate() {
    let token = this.service.getUserLoggedIn();
    if(token != null && token['.expires']){
      let dateExpired = new Date(token['.expires']);
      if(new Date() < dateExpired ){
        this.service.token = token;
        return true; 
      }
    }
    this.router.navigate(['/login']);
    return false;

  }
    
    
  
}