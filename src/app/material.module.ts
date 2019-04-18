import { NgModule } from '@angular/core';
import { 
    MatButtonModule, 
    MatMenuModule, 
    MatTableModule,
    MatToolbarModule, 
    MatIconModule, 
    MatSelectModule, 
    MatCardModule, 
    MatAutocompleteModule,
    MatInputModule,
    MatSidenavModule, 
    MatListModule, 
    MatTabsModule,
    MatNativeDateModule,
    MatSortModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatFormFieldModule, 
    NativeDateAdapter
} from '@angular/material';


@NgModule({
    imports: [
        MatButtonModule, 
        MatMenuModule, 
        MatToolbarModule, 
        MatIconModule, 
        MatSelectModule, 
        MatCardModule, 
        MatAutocompleteModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatSidenavModule, 
        MatListModule, 
        MatTabsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatFormFieldModule
    ],
    exports: [
        MatButtonModule, 
        MatMenuModule, 
        MatToolbarModule, 
        MatIconModule, 
        MatTableModule,
        MatSelectModule, 
        MatCardModule, 
        MatTabsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSortModule,
        MatSidenavModule, 
        MatListModule, 
        MatNativeDateModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatFormFieldModule
    ]
})
export class MaterialModule { }

export class MyDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        const day = date.getDay();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
  }