import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
})
export class TableFilterComponent implements OnInit {
  @Input() data: any;
  @Input() searchFields: [];
  @Output() tableData = new EventEmitter();
  filter: FormControl;
  filter$: Observable<string>;

  constructor() {
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(debounceTime(1000), startWith(''));
  }

  ngOnInit(): void {
    combineLatest([of(this.data), this.filter$])
      .pipe(
        map((res: any) =>
          res[0].filter((val: any) => {
            if (res[1] !== '') {
              let filterValue = false;
              for (let i = 0; i < this.searchFields.length; i++) {
                console.log(val[this.searchFields[i]]);
                if (
                  val[this.searchFields[i]] &&
                  val[this.searchFields[i]].toString().toLowerCase().includes(res[1].toLowerCase())
                ) {
                  filterValue = true;
                  break;
                }
              }
              return filterValue;
            }
            return val;
          })
        )
      )
      .subscribe((res) => {
        setTimeout(() => {
          this.tableData.emit(res);
        }, 100);
      });
  }
}
