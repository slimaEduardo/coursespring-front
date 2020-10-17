import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente : ClienteDTO

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageService, public clienteService : ClienteService, public loadController: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
     
        this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
          loader.dismiss();
        },
        error => {
          if(error.status == 403){
            loader.dismiss();
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else{
      loader.dismiss();
       this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
    },
    error => {});
  }

  presentLoading(){
    let loader = this.loadController.create({
      content: "Aguarde...",
     });
    loader.present();
    return loader;
  }
}
