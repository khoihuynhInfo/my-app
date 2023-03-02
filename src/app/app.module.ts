import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TasksModules } from './modules/tasks/tasks.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        loadChildren: () => import('./modules/tasks/tasks-routing.module').then(m => m.TaskRoutingModule)
      },
      { path: '**', component: PageNotFoundComponent }
    ]),
    TasksModules,
    CoreModule
  ],
  providers: [
    BackendService,
    { provide: MatDialogRef, useValue: [] }
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
