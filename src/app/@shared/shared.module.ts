import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderComponent } from './loader/loader.component';
import { TableFilterComponent } from './table-filter/table-filter.component';
import { TableSortableHeaderDirective } from './directives/table-sortable-header/table-sortable-header.directive';
import { TrendDetailsComponent } from './trend-details/trend-details.component';
import { ViewTrendDetailsComponent } from './view-trend-details/view-trend-details.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    LoaderComponent,
    TableFilterComponent,
    TableSortableHeaderDirective,
    TrendDetailsComponent,
    ViewTrendDetailsComponent,
  ],
  exports: [
    LoaderComponent,
    TableFilterComponent,
    TableSortableHeaderDirective,
    TrendDetailsComponent,
    ViewTrendDetailsComponent,
  ],
})
export class SharedModule {}
