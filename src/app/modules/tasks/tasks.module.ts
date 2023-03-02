import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddFormTaskComponent } from './add-form-task/add-form-task.component';
import { TaskComponent } from './task/task.component';
import { TaskResolver } from './shared/resolves/task.resolve';
import { TaskRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TasksDetailComponent } from './task-detail/task-detail.component';
import { TasksMaterialModules } from './tasks-material.module';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        FormsModule,
        ReactiveFormsModule,
        TaskRoutingModule,
        TasksMaterialModules
    ],
    declarations: [
        AddFormTaskComponent,
        TasksDetailComponent,
        TaskComponent,
        TasksComponent
    ],
    providers: [
        TaskResolver
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class TasksModules { }