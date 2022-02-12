import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentDate: any;
  constructor(private router: Router) {
    this.currentDate = new Date().getFullYear();
  }

  ngOnInit() {}

  gotoContactus() {
    this.router.navigate(['/contactUs'], { replaceUrl: true });
  }
}
