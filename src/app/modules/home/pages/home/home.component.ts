import { Component, OnInit } from '@angular/core';

import { HomeMenu } from '../../models/home-menu.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public menus: HomeMenu[] = [
    {
      icon: '../../../../../assets/icons/file-summary.png',
      link: '../equipment/summary',
      name: 'Resumen de Equipos'
    },
    {
      icon: '../../../../../assets/icons/file-search.png',
      link: '../equipment/detail',
      name: 'Detalle de Equipos'
    },
    {
      icon: '../../../../../assets/icons/laptop-create.png',
      link: '../equipment/create',
      name: 'Crear Equipo'
    },
    {
      icon: '../../../../../assets/icons/laptop-baja.png',
      link: '../equipment/fault',
      name: 'Rotura de Equipos'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
