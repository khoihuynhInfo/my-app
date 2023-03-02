import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';

import { BackendService } from 'src/app/backend.service';
import { BaseComponent } from 'src/app/components/base-component/base.component';

@Component({
    selector: 'app-form-task',
    templateUrl: './add-form-task.component.html',
    styleUrls: ['./add-form-task.component.scss']
})
export class AddFormTaskComponent extends BaseComponent {
    descriptionControl = new FormControl( '', Validators.required );
    
    constructor(
        private backendService: BackendService,
        private dialogRef: MatDialogRef<AddFormTaskComponent>
    ) { 
        super();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    submit(): void {
        if ( this.descriptionControl.invalid ) {
            return;
        }

        const payload = { description: this.descriptionControl.value }

        this.backendService.addNewTask( payload ).pipe(
            takeUntil( this.destroyed$ )
        ).subscribe( () => {
            this.dialogRef.close( true );
        } );
    }
}