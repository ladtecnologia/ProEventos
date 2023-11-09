import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/Evento';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
  //providers: [EventoService]
})

export class EventoListaComponent implements OnInit {
  public modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados : Evento[] = [];
  public exibirImagem = true;
  public eventoId = 0;

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
    private spinner: NgxSpinnerService,
    private router: Router) {}

 public ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  public carregarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Eventos não carregados !', 'Erro');
      }
    }).add(() => this.spinner.hide());
  }

  public openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template);
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
          this.toastr.success('Evento excluído !', 'Sucesso');
          this.carregarEventos();
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(`Evento ${this.eventoId} não excluído !`, 'Erro');
      }
    }).add(() => this.spinner.hide());
  }

  public decline(): void {
    this.modalRef?.hide();
    this.toastr.info('Evento não excluído !', 'Cancelado');
  }

  public detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
