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
  username: string = "mpesalac12";
  password: string = "AQswde12";

  constructor(private router: Router, private service: RestService) {  }
  ngOnInit(): void {
  }

  login() {
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
