import { Component } from '@angular/core';
import { ParentsComponent } from '../parents/parents.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-parent-info',
  imports: [ParentsComponent],
  templateUrl: './parent-info.component.html',
  styleUrl: './parent-info.component.css'
})
export class ParentInfoComponent {

        // Define the COURSES table data
//fake DB
parentsTab:any = [];

  foundParent:any = {};

    //Creer new instance cad constructor
constructor(private userService:UserService) {}
 
  ngOnInit() {
    let MID = localStorage.getItem("parentId");
     this.userService.getParentById (MID).subscribe(
      (data)=>{
        console.log("here is user service response after getting parent by id:", data);
        this.foundParent = data.user;
      }

    );
 

}

}
