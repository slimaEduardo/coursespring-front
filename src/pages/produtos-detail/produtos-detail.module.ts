import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutosDetailPage } from './produtos-detail';

@NgModule({
  declarations: [
    ProdutosDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutosDetailPage),
  ],
})
export class ProdutosDetailPageModule {}
