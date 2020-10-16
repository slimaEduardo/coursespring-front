import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Thumbnail } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

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

  pedido : PedidoDTO;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: StorageService, 
    public clienteService: ClienteService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
        this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.items = response['addresses'];

          let cart = this.cartService.getCart();

          this.pedido = {
            client: {id: response['id']},
            deliveryAddress: null,
            payment: null,
            items: cart.items.map(x => { return {quantity: x.quantity, product: {id: x.product.id}}}),
          }
        },
        error => {
          if(error.status == 403){
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else{
      this.navCtrl.setRoot('HomePage');
    }
  }
   
  nextPage(item: EnderecoDTO){
    this.pedido.deliveryAddress = {id: item.id};
    this.navCtrl.push('PaymentPage', {pedido: this.pedido});
    
  }

}