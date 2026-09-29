import { Routes } from '@angular/router';

import { AddCoursComponent } from './components/add-cours/add-cours.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { SignupTeacherComponent } from './components/signup-teacher/signup-teacher.component';
import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { ParentComponent } from './components/parent/parent.component';
import { TeacherInfoComponent } from './components/teacher-info/teacher-info.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { TeacherEditComponent } from './components/teacher-edit/teacher-edit.component';
import { StudentInfoComponent } from './components/student-info/student-info.component';
import { StudentEditComponent } from './components/student-edit/student-edit.component';
import { ParentInfoComponent } from './components/parent-info/parent-info.component';
import { ParentEditComponent } from './components/parent-edit/parent-edit.component';
import { SignupAdminComponent } from './components/signup-admin/signup-admin.component';
import { SignupStudentComponent } from './components/signup-student/signup-student.component';
import { SignupParentComponent } from './components/signup-parent/signup-parent.component';
import { StudentsComponent } from './components/students/students.component';
import { ParentsComponent } from './components/parents/parents.component';
import { CoursInfoComponent } from './components/cours-info/cours-info.component';
import { CoursEditComponent } from './components/cours-edit/cours-edit.component';
import { AddEvaluationComponent } from './components/add-evaluation/add-evaluation.component';
import { SearchTeachersComponent } from './components/search-teachers/search-teachers.component';
import { EvaluationsInfoComponent } from './components/evaluations-info/evaluations-info.component';
import { EvaluationEditComponent } from './components/evaluation-edit/evaluation-edit.component';
import { AddClassesComponent } from './components/add-classes/add-classes.component';
import { ClassesInfoComponent } from './components/classes-info/classes-info.component';
import { ClassesEditComponent } from './components/classes-edit/classes-edit.component';
import { ClassesComponent } from './components/classes/classes.component';
import { SearchStudentsComponent } from './search-students/search-students.component';
import { roleGuard } from './components/role.guard';

export const routes: Routes = [
    // 🌍 Routes Publiques
    { path: "", component: HomeComponent },
    { path: 'signupteacher', component: SignupTeacherComponent },
    { path: 'signupAdmin', component: SignupAdminComponent },
    { path: 'signupstudent', component: SignupStudentComponent },
    { path: 'signupparent', component: SignupParentComponent },
    { path: 'signin', component: LoginComponent },

    // 🟢 Routes AUTORISÉES pour l'Étudiant (uniquement student et searchteachers)
    { 
        path: 'student', 
        component: StudentComponent, 
        canActivate: [roleGuard(['student', 'admin', 'teacher'])] // 👈 Ajout de 'admin' et 'teacher' ici
    },
    { 
        path: 'searchteachers', 
        component: SearchTeachersComponent, 
        canActivate: [roleGuard(['student', 'teacher', 'admin', 'parent', 'parent'])] 
    },

  // ✅ Routes CORRIGÉES
{ 
  path: 'addCours', 
  component: AddCoursComponent, 
  canActivate: [roleGuard(['teacher', 'admin'])] 
},
{ 
  path: 'coursInfo', 
  component: CoursInfoComponent, 
  // L'étudiant est maintenant autorisé à consulter les informations du cours
  canActivate: [roleGuard(['teacher', 'admin', 'parent', 'student'])] 
},
{ 
  path: 'coursEdit', 
  component: CoursEditComponent, 
  canActivate: [roleGuard(['teacher', 'admin'])] 
},
    // 🔒 Routes INTERDITES à l'Étudiant (Espace Administration)
    { path: 'admin', component: AdminComponent, canActivate: [roleGuard(['admin'])] },

    // 🔒 Routes INTERDITES à l'Étudiant (Espace Enseignants & Autres Profils)
   { 
    path: 'teacher', 
    component: TeacherComponent, 
    canActivate: [roleGuard(['teacher', 'admin'])] // 👈 Assurez-vous d'avoir 'teacher' et 'admin' ici
},

    { path: 'teachers', component: TeachersComponent, canActivate: [roleGuard(['admin'])] },
    { path: 'teacherinfo', component: TeacherInfoComponent, canActivate: [roleGuard(['teacher', 'admin'])] },
    { path: 'teacherEdit', component: TeacherEditComponent, canActivate: [roleGuard(['teacher', 'admin'])] },

    // 🔒 Routes INTERDITES à l'Étudiant (Gestion globale des autres étudiants)
    { path: 'students', component: StudentsComponent, canActivate: [roleGuard(['teacher', 'admin'])] },
    { path: 'studentInfo', component: StudentInfoComponent, canActivate: [roleGuard(['teacher', 'admin', 'parent'])] },
    { path: 'studentEdit', component: StudentEditComponent, canActivate: [roleGuard(['teacher', 'admin'])] },
    { path: 'searchstudents', component: SearchStudentsComponent, canActivate: [roleGuard(['teacher', 'admin', 'parent'])] },
    
    // 🔒 Routes INTERDITES à l'Étudiant (Espace Parents)
    { path: 'parent', component: ParentComponent, canActivate: [roleGuard(['admin'])] },
    { path: 'parents', component: ParentsComponent, canActivate: [roleGuard(['admin'])] },
    { path: 'parentEdit', component: ParentEditComponent, canActivate: [roleGuard(['parent', 'admin'])] },
    { path: 'parentInfo', component: ParentInfoComponent, canActivate: [roleGuard(['teacher', 'admin', 'parent'])] },

    // 🔒 Routes INTERDITES à l'Étudiant (Gestion des Évaluations/Notes)
    { path: 'addevaluation', component: AddEvaluationComponent, canActivate: [roleGuard(['teacher', 'admin'])] },
    { path: 'evaluationInfo', component: EvaluationsInfoComponent, canActivate: [roleGuard(['teacher', 'admin', 'parent', 'student'])] }, // L'étudiant ne passe pas par là pour sa note directe
    { path: 'evaluationEdit', component: EvaluationEditComponent, canActivate: [roleGuard(['teacher', 'admin'])] },

    // 🔒 Routes INTERDITES à l'Étudiant (Gestion des Classes)
    { path: 'classe', component: ClassesComponent, canActivate: [roleGuard(['teacher', 'admin'])] }, 
    { path: 'addclasse', component: AddClassesComponent, canActivate: [roleGuard(['admin'])] },
    { path: 'classeInfo', component: ClassesInfoComponent, canActivate: [roleGuard(['teacher', 'admin'])] },
    { path: 'classeEdit', component: ClassesEditComponent, canActivate: [roleGuard(['admin'])] }
];
