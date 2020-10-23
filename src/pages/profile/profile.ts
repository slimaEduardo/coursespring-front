import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
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

  cliente : ClienteDTO;
  picture : string;
  cameraOn : boolean = false;
  profileImage;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: StorageService, 
    public clienteService : ClienteService, 
    public loadController: LoadingController,
    public camera: Camera,
    public sanitizer: DomSanitizer) {
      this.profileImage = 'assets/imgs/avatar-blank.png';
  }

  ionViewDidLoad() {
   this.loadData();
  }
  loadData() {
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
      this.cliente.imageUrl = this.profileImage;
      this,this.blobToDataURL(response).then(dataUrl => {
        let str : string = dataUrl as string; 
        this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str);
      })
    },
    error => {
      this.profileImage = 'assets/imgs/avatar-blank.png';
    });
  }

  blobToDataURL(blob) {
    return new Promise((fulfill, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => fulfill(reader.result);
        reader.readAsDataURL(blob);
    })
  }

  presentLoading(){
    let loader = this.loadController.create({
      content: "Aguarde...",
     });
    loader.present();
    return loader;
  }

  getCameraPicture(){

    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
    this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
     // Handle error
     this.cameraOn = false;
    });
  }

  getGaleryPicture(){

    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
    this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
     // Handle error
     this.cameraOn = false;
    });
  }

  sendPicture(){
    this.clienteService.uploadPicture(this.picture).subscribe(response => {
      this.picture = null;
      this.getImageIfExists();
      this.loadData();
    },
    error => {});
  }

  cancel(){
    this.picture = null;
  }

}

