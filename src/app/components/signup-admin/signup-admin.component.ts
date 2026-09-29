import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup-admin',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './signup-admin.component.html',
  styleUrl: './signup-admin.component.css'
})
export class SignupAdminComponent {

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
      this.path = this.router.url;
      console.log("Here is path",this.path);
      
      this.signupForm = this.builder.group({
      firstName: ["",[Validators.required, Validators.minLength(3),Validators.pattern('[a-zA-Z]+$')]],
      lastName: ["",[Validators.required, Validators.minLength(3),Validators.pattern('[a-zA-Z]+$')]],
      email: ["",[Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(8), Validators.pattern(this.phoneRegex)]],
      adress: ["",[Validators.required]],
      pwd: ["",[Validators.required, Validators.minLength(8),Validators.maxLength(10)]],
   
   
    });
  }

  

  addUser() {

    console.log("User Object", this.signupForm.value);
    if (this.path == '/signupAdmin'){
      this.signupForm.value.role = 'Admin';
      this.signupForm.value.status = 'approved';
    }else if (this.path == '/signupparent'){
      this.signupForm.value.role = 'Parent';
      this.signupForm.value.status = 'approved';
    }else if (this.path == '/signupteacher'){
     this.signupForm.value.role = 'Teacher';
     this.signupForm.value.status = 'pending';

    }else  {
     this.signupForm.value.role = 'Student';
      this.signupForm.value.status = 'approved';
    }




   this.userService.addUser(this.signupForm.value,this.file).subscribe(
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

   onImageSelected(event: Event){
   const inputElement = event.target as HTMLInputElement;
     if (inputElement && inputElement.files && inputElement.files.length > 0) { 
     this.file = inputElement.files[0]; 
     console.log("Here is the selected file", this.file);

}

}
  

}
