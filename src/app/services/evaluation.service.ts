import { Injectable } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http'; // 1. L'import obligatoire
import { createObject } from 'rxjs/internal/util/createObject';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

//Backend address(l'adresse de notre application BE)
evaluationsURL:string = "http://localhost:3000/evaluations";  
//httpClient is used to send requests to the backend

  constructor(private httpClient: HttpClient) { }

   //Request to get all evaluations
  // EvaluationComponent  and Evaluation Table Component
  getAllEvaluations() {
    return this.httpClient.get<{ tab:any }>(this.evaluationsURL)
  }

   //Request to get evaluations by ID
 // Evaluations info Component
  getEvaluationsById(id: any) {
    return this.httpClient.get<{ evaluation: any }>(this.evaluationsURL + "/" +id);
  }

    //Request to delete evaluations by ID
//Btn ds Evaluations Table Component
  deleteEvaluationById(id: number) {
    return this.httpClient.delete<{msg: string }>(this.evaluationsURL + "/" + id);
  }

    //Request to add evaluations
  //Add Evaluations Component
   // this.evaluations fi add EvaluationsComponent.ts
  addEvaluations(obj: any) {

    return this.httpClient.post <{msg : string}>(this.evaluationsURL, obj);
  
  }

  //Request to edit evaluations
   // Edit Evaluations  Component
   // this.evaluations fi editEvaluationsComponent.ts

  editEvaluationsById( obj: any) {

    return this.httpClient.put<{ msg: string }>(this.evaluationsURL, obj);
  }


}
