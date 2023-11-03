import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})

export class TituloComponent implements OnInit{

  @Input() titulo = '';
  @Input() subtitulo = 'by Essencis';
  @Input() iconClass = 'fas fa-user';
  @Input() botaoListar = false;

  constructor(private router: Router) {
  };

  public ngOnInit(): void {  }

  public listar(): void {
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`]);
  }

}
