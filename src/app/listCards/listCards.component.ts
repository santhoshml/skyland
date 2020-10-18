import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { ListCardsService } from './listCards.service';
import { Observable } from 'rxjs';

export interface ListCard {
  key: string;
  tags : string[];
  desc: string;
  title: string;
}

@Component({
  selector: 'app-listCards',
  templateUrl: './listCards.component.html',
  styleUrls: ['./listCards.component.scss'],
})
export class ListCardsComponent implements OnInit {
  version: string | null = environment.version;
  cardArr: ListCard[];
  isLoading = false;
  listCard$: Observable<any>;
  
  constructor(private listCardsService: ListCardsService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.listCard$ = this.listCardsService.getAllCards();
  }

  getList(selectedCard : ListCard){
    console.log(`In getList, selectedCard : ${JSON.stringify(selectedCard)} `);
    console.log(`target URL: listDetails/${selectedCard.key}`);
    this.router.navigate([`listDetails`, selectedCard.key], { replaceUrl: true });
  }

}
