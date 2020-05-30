import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {  MatButtonModule } from '@angular/material/button';
import {  MatCardModule } from '@angular/material/card';
import {  MatCheckboxModule } from '@angular/material/checkbox';
import {  MatDatepickerModule } from '@angular/material/datepicker';
import {  MatFormFieldModule } from '@angular/material/form-field';
import {  MatIconModule } from '@angular/material/icon';
import {  MatInputModule } from '@angular/material/input';
import {  MatListModule } from '@angular/material/list';
import {  MatMenuModule } from '@angular/material/menu';
import {  MatNativeDateModule } from '@angular/material/core';
import {  MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {  MatRadioModule } from '@angular/material/radio';
import {  MatSelectModule } from '@angular/material/select';
import {  MatSidenavModule } from '@angular/material/sidenav';
import {  MatSortModule } from '@angular/material/sort';
import {  MatTableModule } from '@angular/material/table';
import {  MatTabsModule } from '@angular/material/tabs';
import {  MatToolbarModule } from '@angular/material/toolbar';
import {  NativeDateAdapter} from '@angular/material/core';

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
export class MaterialModule {}

export class MyDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: any): string {
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
