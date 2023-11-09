import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';

  get f(): any {
    return this.form.controls;
  }

  get bsconfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(public fb: FormBuilder,
              private localeService: BsLocaleService,
              private router: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService)
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void
  {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    if (eventoIdParam != null) {
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento };
          this.form.patchValue(this.evento);
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Evento não carregado !', 'Erro');
        }
      }).add(() => this.spinner.hide());
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  private validation(): void {
    this.form = this.fb.group({
      tema:       ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local:      ['', [Validators.required]],
      dataEvento: ['', [Validators.required]],
      qtdPessoas: ['', [Validators.required, Validators.min(10), Validators.max(1000)]],
      telefone:   ['', [Validators.required]],
      email:      ['', [Validators.required, Validators.email]],
      imagemURL:  ['', [Validators.required]],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return {'is-invalid' : campoForm.errors && campoForm.touched};
  }

  public salvarAlteracao(): void {
    if (this.form.valid){
      this.spinner.show();
      if (this.estadoSalvar == 'post') {
        //POST
        this.evento = { ...this.form.value}; }
      else {
        //PUT
        this.evento = {id: this.evento.id, ...this.form.value};}

      this.eventoService[this.estadoSalvar](this.evento).subscribe({
        next: (evento: Evento) => {
          this.toastr.success('Evento salvo com sucesso !', 'Sucesso');
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Evento não foi salvo !', 'Erro');
        }
      }).add(() => this.spinner.hide());

    }
  }

}
