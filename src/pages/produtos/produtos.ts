import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[] = [];
  page : number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService, public loadController: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();       
  }

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10).subscribe(response => {
      let start = this.items.length;
      this.items = this.items.concat(response['content']);
      let end = this.items.length - 1;
      loader.dismiss();
      this.loadImageUrls(start, end);
    },
    error => {
      loader.dismiss();
    });
  }

  loadImageUrls(start : number, end : number){
    for(var i=start; i<=end; i++){
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id).subscribe(response => {
        item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
      },
      error => {});
    }
  }

  showDetail(produto_id : string){
    this.navCtrl.push('ProdutosDetailPage', {produto_id: produto_id});

  }

  presentLoading(){
    let loader = this.loadController.create({
      content: "Aguarde...",
     });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
     setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll){
    this.page++;
    this.loadData();
    setTimeout(() => {
     infiniteScroll.complete();
    }, 2000);
  }
}

