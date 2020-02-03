import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'partie-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private readonly router:Router) { }

  ngOnInit() {
  }

  navigate(url): void {
    this.router.navigateByUrl(url);
  }
}
