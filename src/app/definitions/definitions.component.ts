import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export interface TagDefinition {
  title: string;
  desc: string;
  links: string[];
}

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.scss'],
})
export class DefinitionsComponent implements OnInit {
  version: string | null = environment.version;

  definitionsArr: TagDefinition[] = [
    {
      title: 'Price < $20',
      desc: 'List of stocks whose end of day price is less than $20',
      links: [],
    },
    {
      title: 'Price < $50',
      desc: 'List of stocks whose end of day price is greater then $20 and less than $50',
      links: [],
    },
    {
      title: 'Price < $100',
      desc: 'List of stocks whose end of day price is greater then $50 and less than $100',
      links: [],
    },
    {
      title: 'Price > $100',
      desc: 'List of stocks whose end of day price is greater then $100',
      links: [],
    },
  ];

  constructor() {}

  ngOnInit() {}
}
