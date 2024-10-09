import {NgModule} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';

@NgModule({
  exports: [
    CdkStepperModule,
    DragDropModule,
    MatButtonModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    CdkTableModule,
    MatRadioModule,
    MatSnackBarModule
  ]
})
export class DemoMaterialModule {}


/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */