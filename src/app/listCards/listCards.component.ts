import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { ListCardsService } from './listCards.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
    this.listCard$ = this.listCardsService.getAllCards().pipe(
      map((body: any, headers:any)=>{
        // console.log(`body: ${JSON.stringify(body)}`);
        // console.log(`headers: ${JSON.stringify(headers)}`);
        return body;
      }),
      catchError((err) => {
        if(err.status === 401){
          this.router.navigate(['/login', {errMsg: 'Session expired. Login please.'}], { replaceUrl: true });
        } else {
          return of(false)
        }
      })
    )

  }

  getList(selectedCard : ListCard){
    // console.log(`In getList, selectedCard : ${JSON.stringify(selectedCard)} `);
    // console.log(`target URL: listDetails/${selectedCard.key}`);
    this.router.navigate([`listDetails`, selectedCard.key], { replaceUrl: true });
  }

}
