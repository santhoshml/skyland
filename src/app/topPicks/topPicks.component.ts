import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { TopPicksService } from './topPicks.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService, CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

@Component({
  selector: 'app-listCards',
  templateUrl: './topPicks.component.html',
  styleUrls: ['./topPicks.component.scss'],
})
export class TopPicksComponent implements OnInit {
  version: string | null = environment.version;
  isLoading = false;
  userProfile$: Observable<any>;
  topStocks$: Observable<any>;
  yourBestStocks$: Observable<any>;
  hasConfidenceScore = false;
  
  constructor(private service: TopPicksService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter("listCards-init", "topPicks", "init", "topPicks", 1,this.credentialsService.credentials.id);
    
    // set user profile
    this.userProfile$=this.authenticationService.getUserModelProfile().pipe(
      map(body=>{
        this.credentialsService.setUserProfile(body);
        return body;
      })
    )

    this.topStocks$ = this.service.getTopStocks().pipe(
      map(body=>{
        console.log(`topStocks : ${JSON.stringify(body)}`);        
        if(body && body.length> 0 && body[0].confidence){
          this.hasConfidenceScore = true;
        }
        console.log(`this.hasConfidenceScore : ${this.hasConfidenceScore}`);
        return body;
      })
    );

    this.yourBestStocks$ = this.service.getYourBestStocks().pipe(
      map(body=>{
        console.log(`yourBestStocks: ${JSON.stringify(body)}`);
        if(body.list && body.list.list){
          return body.list.list;
        }
      })
    );
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
    this.googleAnalyticsService.eventEmitter("topPicks", "favorites", "addToFavorites", "addToFavorites", 1,this.credentialsService.credentials.id);
    this.symbolDetailsService.addToFavorites(symbol).subscribe();
  }

  removeFromFavorites(symbol:string){
    this.googleAnalyticsService.eventEmitter("topPicks", "favorites", "removeFromFavorites", "removeFromFavorites", 0,this.credentialsService.credentials.id);
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe();
  }
}
