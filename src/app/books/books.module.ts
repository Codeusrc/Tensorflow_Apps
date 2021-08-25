import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BooksRoutingModule } from './books-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    ListComponent
    ],
  imports: [
    CommonModule,
	FormsModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }
