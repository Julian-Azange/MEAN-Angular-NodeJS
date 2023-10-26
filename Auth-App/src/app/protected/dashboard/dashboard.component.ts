import { AuthService } from './../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  get usuario(){
    return this.authService.Usuario;
  }
  constructor( private router: Router,
    private authService: AuthService ) { }

  ngOnInit(): void {
  }

  logout(){
    this.router.navigateByUrl('/auth');
  }

}
