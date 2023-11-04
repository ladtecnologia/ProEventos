import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(public fb: FormBuilder) {  }

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {

    const formOptions: AbstractControlOptions = {
      validators : ValidatorField.MustMatch('senha', 'confirmaSenha')
    }

    this.form = this.fb.group({
      primeiroNome:   ['', [Validators.required]],
      ultimoNome:     ['', [Validators.required]],
      email:          ['', [Validators.required, Validators.email]],
      userName:       ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      senha:          ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmaSenha:  ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    }, formOptions);
  }

  public resetForm(): void {
    this.form.reset();
  }
}
