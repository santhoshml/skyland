import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderComponent } from './loader/loader.component';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { TableSortableHeaderDirective } from './directives/table-sortable-header/table-sortable-header.directive';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [LoaderComponent, TableFilterComponent, TableSortableHeaderDirective],
  exports: [LoaderComponent, TableFilterComponent, TableSortableHeaderDirective],
})
export class SharedModule {}
