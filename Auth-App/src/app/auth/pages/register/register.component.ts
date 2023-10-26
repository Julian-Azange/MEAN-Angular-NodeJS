import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  miFormulario: FormGroup = this.fb.group({
    name: ['Text4', [Validators.required]],
    email: ['luis1@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],

  });


  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  registro() {
    //console.log(this.miFormulario.value);

    const { name, email, password } = this.miFormulario.value;

    this.authService.registro( name, email, password )
    .subscribe((ok) => {

      if ( ok === true ) {
        this.router.navigateByUrl('/dashboard');
      }else{
        Swal.fire('Error', ok, 'error')
      }
    });
   // this.router.navigateByUrl('/dashboard');
  }

}
