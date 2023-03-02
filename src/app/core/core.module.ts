import { NgModule } from '@angular/core';

import { GuardService } from './services/guard.service';

@NgModule( { 
    providers: [
        GuardService
    ]
} )
export class CoreModule {}