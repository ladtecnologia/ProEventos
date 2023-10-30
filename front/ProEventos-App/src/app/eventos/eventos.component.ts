import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
  //providers: [EventoService]
})

export class EventosComponent implements OnInit {
  public modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados : Evento[] = [];
  public exibirImagem = true;

  private _filtroLista = '';

  public get filtroLista() : string{
    return this._filtroLista;
  }

  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string) : Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
                       evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
    private eventoService : EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {}

 public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
        next: (eventos: Evento[]) => {
          this.eventos = eventos;
          this.eventosFiltrados = this.eventos;
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Eventos não carregados !', 'Erro');
        },
        complete: () => this.spinner.hide()
      })
  }

  //
  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  public confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('Evento excluído !', 'Sucesso');
  }

  public decline(): void {
    this.modalRef?.hide();
    this.toastr.info('Evento não excluído !', 'Cancelado');
  }

}
