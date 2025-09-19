import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule , CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  chekToken: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    // Ensure code only runs in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      // this.chekToken = !!token;
      if(token) {
        this.chekToken = true;
      }
    }
    // console.log(this.chekToken);
  }

}
