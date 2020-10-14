import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';

/**
 * Generated class for the PickAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items : EnderecoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = [
      {
        id: "1",
        publicPlace: "Rua Quinze de Novembro",
        number: "300",
        complement: "Apto 200",
        district: "Santa Mônica",
        cep: "48293822",
        city: {
          id: "1",
          name: "Uberlândia",
          state: {
            id: "1",
            name: "Minas Gerais"
          }
        }
      },
      {
        id: "2",
        publicPlace: "Rua Alexandre Toledo da Silva",
        number: "405",
        complement: null,
        district: "Centro",
        cep: "88933822",
        city: {
          id: "3",
          name: "São Paulo",
          state: {
            id: "2",
            name: "São Paulo"
          }
        }
      }
    ];
  }

}
