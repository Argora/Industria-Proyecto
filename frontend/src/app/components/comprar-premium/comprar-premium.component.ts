import { Component, OnInit } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-comprar-premium',
  templateUrl: './comprar-premium.component.html',
  styleUrls: ['./comprar-premium.component.css']
})
export class ComprarPremiumComponent implements OnInit {

  public isCollapsed = false;

  constructor() { }

  ngOnInit(): void {
  }

}
