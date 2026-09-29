import { Injectable } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http'; // 1. L'import obligatoire
import { createObject } from 'rxjs/internal/util/createObject';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

    //Backend address(l'adresse de notre application BE)
classesURL:string = "http://localhost:3000/classes";  
//httpClient is used to send requests to the backend

  constructor(private httpClient: HttpClient) { }

  //Request to get all classes
  // classesComponent  and classes Table Component
  getAllClasses() {
    return this.httpClient.get<{ tab:any }>(this.classesURL)
  }

     //Request to get classes by ID
 // classes info Component
  getClassesById(id: any) {
    return this.httpClient.get<{ classe: any }>(this.classesURL + "/" +id);
  }

      //Request to delete cours by ID
//Btn ds Classes Table Component
  deleteClassesById(id: number) {
    return this.httpClient.delete<{msg: string }>(this.classesURL + "/" + id);
  }
    //Request to add cours
  //Add Cours Component
   // this.cours fi add CoursComponent.ts
  addClasses(obj: any) {

    return this.httpClient.post <{msg : string}>(this.classesURL, obj);
  
  }

    //Request to edit cours
   // Edit Cours  Component
   // this.cours fi editCoursComponent.ts

  editClassesById( obj: any) {

    return this.httpClient.put<{ msg: string }>(this.classesURL, obj);
  }

}
