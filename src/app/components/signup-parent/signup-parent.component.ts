import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-parent',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './signup-parent.component.html',
  styleUrl: './signup-parent.component.css'
})
export class SignupParentComponent {

user:any = {};
errorMsg!: string;
path!: string;
file: any; //mil fou9

 //Form Id

  signupForm! : FormGroup;

   // Matches optional '+' followed by 10 to 15 digits
  private phoneRegex = /^\+?[0-9]{10,15}$/; 

   constructor(private builder: FormBuilder,private userService:UserService ,private router:Router) { }

    ngOnInit() {

    this.signupForm = this.builder.group({
      firstName: ["",[Validators.required, Validators.minLength(3),Validators.pattern('[a-zA-Z]+$')]],
      lastName: ["",[Validators.required, Validators.minLength(6),Validators.pattern('[a-zA-Z]+$')]],
      email: ["",[Validators.required, Validators.email]],
      phone: ["",[Validators.required, Validators.minLength(6),Validators.pattern(this.phoneRegex)]],
      adress: ["",[Validators.required]],
      pwd: ["",[Validators.required, Validators.minLength(8),Validators.maxLength(10)]],
   
   
    });
  }

  signupparent() {

    console.log("User Object", this.signupForm.value);

     if (this.path == '/signupAdmin'){
      this.signupForm.value.role = 'admin';
    }else { (this.path == '/signupparent')
      this.signupForm.value.role = 'parent';
    }
    this.userService.addParent(this.signupForm.value).subscribe(
      (response) => {
           console.log("Here is user service response after adding user",response);

     //si non, afficher un msg erreur sous la form 'Email already exists'
   //'Email already exists'
	  
      if (response.msg == 'Email already exists') {
        this.errorMsg = response.msg;
       
      } else {
        
        //Naviguer vers login component si l'ajout est effectue apres success
	     //SI non, afficher un msg d'erreur sous le form "Match Not Edited"
         this.router.navigate(["signin"]);

      }       
        
    }

    );

  }

}
