import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Adresse de base de notre API (contient déjà /users)
  userURL: string = "http://localhost:3000/users";  

  constructor(private httpClient: HttpClient) { }

  // Inscription classique (Admin ou autre) avec photo
  addUser(obj: any, photo: File) {
    let fData = new FormData();
    fData.append('firstName', obj.firstName);
    fData.append('lastName', obj.lastName);
    fData.append('email', obj.email);
    fData.append('pwd', obj.pwd);
    fData.append('adress', obj.adress);
    fData.append('phone', obj.phone);
    fData.append('role', obj.role);
    fData.append('status', obj.status); 
    fData.append('img', photo);
    return this.httpClient.post<{ msg: string }>(this.userURL, fData);
  }

  // Connexion
  signin(obj: any) {
    return this.httpClient.post<{ msg: string, user: any }>(this.userURL + "/signin", obj);
  }

  // Récupérer tous les utilisateurs
  getAllUsers() {
    return this.httpClient.get<{ tab: any }>(this.userURL);
  }

  // Récupérer un utilisateur par son ID
  getUsersById(id: any) {
    return this.httpClient.get<{ user: any }>(this.userURL + "/" + id);
  }


  getAllStudents() {
    return this.httpClient.get<{ tab: any }>(this.userURL + "/students");
  }

  // Inscription d'un étudiant avec photo et cours
  addStudent(obj: any, photo: File) {
    let fData = new FormData();
    fData.append('firstName', obj.firstName);
    fData.append('lastName', obj.lastName);
    fData.append('email', obj.email);
    fData.append('pwd', obj.pwd);
    fData.append('adress', obj.adress);
    fData.append('phone', obj.phone);
    fData.append('role', obj.role);
    fData.append('img', photo);
    fData.append('courId', obj.courId);
    return this.httpClient.post<{ msg: string }>(this.userURL + "/students", fData);
  }

        // Récupérer un utilisateur par son ID
  getStudentById(id: any) {
    return this.httpClient.get<{ user: any }>(this.userURL + "/students/" + id);
  }

      // Récupérer un utilisateur par son ID
  deleteStudentById(id: number) {
    return this.httpClient.delete<{ msg: string }>(this.userURL + "/students/" + id);
  }

     editStudentById( obj: any) {

    return this.httpClient.put<{ msg: string }>(this.userURL + "/students", obj);
  }


  addParent(obj: any) {
     return this.httpClient.post<{ msg: string }>(this.userURL + "/parents", obj);
  }

    // Récupérer un utilisateur par son ID
  getParentById(id: any) {
    return this.httpClient.get<{ user: any }>(this.userURL + "/parents/" + id);
  }

      // Récupérer un utilisateur par son ID
  deleteParentById(id: number) {
    return this.httpClient.delete<{ msg: string }>(this.userURL + "/parents/" + id);
  }

    getAllParents() {

     return this.httpClient.get<{ tab: any }>(this.userURL + "/parents");
  }

    editParentById( obj: any) {

    return this.httpClient.put<{ msg: string }>(this.userURL + "/parents", obj);
  }



  addTeacher(obj: any) {
     return this.httpClient.post<{ msg: string }>(this.userURL + "/teachers", obj);
  }


  getAllTeachers() {

     return this.httpClient.get<{ tab: any }>(this.userURL + "/teachers");

  }

     editTeacherById( obj: any) {

    return this.httpClient.put<{ msg: string }>(this.userURL + "/teachers", obj);
  }

      // Récupérer un utilisateur par son ID
  geTeacherById(id: any) {
    return this.httpClient.get<{ user: any }>(this.userURL + "/teachers/" + id);
  }

       // Récupérer un utilisateur par son ID
  deleteTeacherById(id: number) {
    return this.httpClient.delete<{ msg: string }>(this.userURL + "/teachers/" + id);
  }


  // URL finale ciblée : http://localhost:3000/users/teachers/:id/status
  updateTeacherStatus(id: any, status: 'approved' | 'rejected') {
    return this.httpClient.patch<{ msg: string }>(this.userURL + "/teachers/" + id + "/status", { status });
  }



searchTeachersByspecialite(specialite: string) {
  return this.httpClient.get<{ msg: string, teachers: any }>(this.userURL + "/teachers/search/" + specialite);
}


searchStudentsByphone (phone:number){

  return this.httpClient.get<{ msg: string ,students: any}>(this.userURL+ "/students/search/" + phone)

}

getStudentsByTeacher(id: string) {
  return this.httpClient.get<{ tab: any[] }>(this.userURL + "/teachers/" + id + "/students");
}


 
}
