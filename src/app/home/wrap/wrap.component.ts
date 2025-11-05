import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wrap',
  templateUrl: './wrap.component.html',
  styleUrls: ['./wrap.component.css'],
})
export class WrapComponent {
  constructor(private router: Router) {}
}
