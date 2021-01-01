import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { ListCardsService } from './listCards.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService, CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

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
  userProfile$: Observable<any>;
  topStocks$: Observable<any>;
  yourBestStocks$: Observable<any>;
  hasConfidenceScore = false;
  
  constructor(private listCardsService: ListCardsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter("listCards-init", "listCards", "init", "listCards", 1,this.credentialsService.credentials.id);
    
    // set user profile
    this.userProfile$=this.authenticationService.getUserModelProfile().pipe(
      map(body=>{
        this.credentialsService.setUserProfile(body);
        return body;
      })
    )

    this.listCard$ = this.listCardsService.getAllCards().pipe(
      map((body: any, headers:any)=>{
        // console.log(`body: ${JSON.stringify(body)}`);
        // console.log(`headers: ${JSON.stringify(headers)}`);
        this.googleAnalyticsService.eventEmitter("listCards-response", "listCards", "response", "getAllCards", 1,this.credentialsService.credentials.id);
        return body;
      }),
      catchError((err) => {
        if(err.status === 401){
          this.router.navigate(['/login', {errMsg: 'Session expired. Login please.'}], { replaceUrl: true });
        } else {
          return of(false)
        }
      })
    );

    this.topStocks$ = this.listCardsService.getTopStocks().pipe(
      map(body=>{
        console.log(`topStocks : ${JSON.stringify(body)}`);        
        if(body && body.length> 0 && body[0].confidence){
          this.hasConfidenceScore = true;
        }
        console.log(`this.hasConfidenceScore : ${this.hasConfidenceScore}`);
        return body;
      })
    );

    this.yourBestStocks$ = this.listCardsService.getYourBestStocks().pipe(
      map(body=>{
        console.log(`yourBestStocks: ${JSON.stringify(body)}`);
        if(body.list && body.list.list){
          return body.list.list;
        }
      })
    );
  }

  getList(selectedCard : ListCard){
    // console.log(`In getList, selectedCard : ${JSON.stringify(selectedCard)} `);
    // console.log(`target URL: listDetails/${selectedCard.key}`);
    this.googleAnalyticsService.eventEmitter("listCards-forwading", "listCards", "forwading", "getList", 1,this.credentialsService.credentials.id);
    this.router.navigate([`listDetails`, selectedCard.key], { replaceUrl: true });
  }

  thumbsUp(symbol: string){
    console.log(`thumbsup for ${symbol}`);
  }

  thumbsDown(symbol: string){
    console.log(`thumbsdown for ${symbol}`);
  }

  isFavorite(symbol: string){
    let favList = this.credentialsService.userFavorites;
    if(favList && favList.length>0){
      for(let fav of favList){
        if(symbol.toUpperCase() == fav.toUpperCase()){
          return true;
        }
      }
    }
    return false;
  }

  addToFavorites(symbol:string){
    this.googleAnalyticsService.eventEmitter("listCards", "favorites", "addToFavorites", "addToFavorites", 1,this.credentialsService.credentials.id);
    this.symbolDetailsService.addToFavorites(symbol).subscribe();
  }

  removeFromFavorites(symbol:string){
    this.googleAnalyticsService.eventEmitter("listCards", "favorites", "removeFromFavorites", "removeFromFavorites", 0,this.credentialsService.credentials.id);
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe();
  }

  randomValue(){
    return Math.floor(Math.random() * 5) + 1;
  }
}
