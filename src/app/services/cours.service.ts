import { Injectable } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http'; // 1. L'import obligatoire




@Injectable({
  providedIn: 'root'
})
export class CoursService {

  //Backend address(l'adresse de notre application BE)
coursURL:string = "http://localhost:3000/cours";  
//httpClient is used to send requests to the backend

  constructor(private httpClient: HttpClient) { }

    //Request to get all cours
  // CoursComponent  and Cours Table Component
  getAllCours() {
    return this.httpClient.get<{ tab:any }>(this.coursURL)
  }

   //Request to get cours by ID
 // Cours info Component
  getCoursById(id: any) {
    return this.httpClient.get<{ cour: any }>(this.coursURL + "/" +id);
  }

    //Request to delete cours by ID
//Btn ds Cours Table Component
  deleteCoursById(id: number) {
    return this.httpClient.delete<{msg: string }>(this.coursURL + "/" + id);
  }

    //Request to add cours
  //Add Cours Component
   // this.cours fi add CoursComponent.ts
  addCours(obj: any) {

    return this.httpClient.post <{msg : string}>(this.coursURL, obj);
  
  }

  //Request to edit cours
   // Edit Cours  Component
   // this.cours fi editCoursComponent.ts

  editCoursById( obj: any) {

    return this.httpClient.put<{ msg: string }>(this.coursURL, obj);
  }

getCoursByTeacherId(teacherId: any) {
  return this.httpClient.get<{ tab: any[] }>(this.coursURL + "/teacher/" + teacherId);
}



getCoursByStudentId(studentId: any)  {
    return this.httpClient.get<{ tab: any[] }>(this.coursURL + "/student/" + studentId);
  

}

}
