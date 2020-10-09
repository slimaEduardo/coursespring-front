import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { EstadoService } from '../../services/domain/estado.service';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder, 
    public cidadeService: CidadeService, 
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertCtrl: AlertController) {

    this.formGroup = this.formBuilder.group({
      name: ['João Santos',[Validators.required, Validators.minLength(5),Validators.maxLength(120)]],
      email: ['joao@gmail.com',[Validators.required, Validators.email]],
      type : ['1', [Validators.required]],
      cpforCnpj : ['02403926043', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      password : ['123', [Validators.required]],
      publicPlace : ['Rua Moquetá', [Validators.required]],
      number : ['9', [Validators.required]],
      complement : ['', []],
      district : ['', []],
      cep : ['26285240', [Validators.required]],
      phone1 : ['71123456789', [Validators.required]],
      phone2 : ['', []],
      phone3 : ['', []],
      estadoId : [null, [Validators.required]],
      cidadeId : [null, [Validators.required]]      
    })
  }

  signupUser(){
    this.clienteService.insert(this.formGroup.value)
    .subscribe(response => {
      this.showInsertOk();
    },
    error => {});
  }
  showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso',
      message: 'Cadastro realizado com sucesso.',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }

  ionViewDidLoad() {
    this.estadoService.findAll().subscribe(response => {
      this.estados = response;
      this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      this.updateCidades();
    },
    error => {});
  }
  updateCidades() {
    let estado_id = this.formGroup.value.estadoId;
      this.cidadeService.findAll(estado_id).subscribe(response => {
      this.cidades = response;
      this.formGroup.controls.cidadeId.setValue(null);
    },
    error => {});
  }

}
