import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/Evento';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject, debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
  //providers: [EventoService]
})

export class EventoListaComponent implements OnInit {
  public modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public exibirImagem = true;
  public eventoId = 0;

  public filtrarPor = '';
  public termoBuscaChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;

  constructor(
    private eventoService : EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router) {}

 public ngOnInit(): void {
    this.pagination = {totalCount:1, currentPage:1, pageSize:3} as Pagination;
    this.carregarEventos();
  }

  public carregarEventos(): void {
    console.log('* carregar eventos ' + this.pagination.currentPage + '-' + this.filtrarPor);
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage,
                                  this.pagination.pageSize,
                                  this.filtrarPor).subscribe({
      next: (paginatedResult: PaginatedResult<Evento[]>) => {
        this.eventos = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Eventos não carregados !', 'Erro');
      },
    } ).add(() => this.spinner.hide());
  }

  public filtrarEventos(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe({
        next: (filtrarPor) => {
          this.pagination.currentPage = 1;
          this.filtrarPor = filtrarPor;
          console.log('** filtrar eventos ' + this.pagination.currentPage + '-' + this.filtrarPor);
          this.carregarEventos();
        }
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public pageChanged(event): void {
    if (this.pagination.currentPage != event.page) {
      console.log('* pageChanged ' + this.pagination.currentPage + '-' + event.page);
      this.pagination.currentPage = event.page;
      this.carregarEventos();
    }
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

  public alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

}
