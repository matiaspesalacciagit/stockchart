import { Component, OnInit } from '@angular/core';
import { RestService } from '../../service/rest.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private router: Router, private service: RestService) {  }
  ngOnInit(): void {
  }

  login() {
    if (JSON.parse(localStorage.getItem('cred'))){
      this.username = JSON.parse(localStorage.getItem('cred'))['username'];
      this.password = JSON.parse(localStorage.getItem('cred'))['password'];
    };
    
    const response = this.service.logIn(this.username, this.password, 'password').subscribe(
      (data) => {
        this.service.token = data;
        this.service.setUserLogged();
        this.router.navigate(['/quote']);
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else if (err instanceof HttpErrorResponse) {
          const msjerror = err.error['error_descript  ion'];
        }
      }
    )

  }




}
