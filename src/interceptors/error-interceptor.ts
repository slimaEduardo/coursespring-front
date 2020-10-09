import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { Observable } from "rxjs";
import { onErrorResumeNext } from "rxjs/operators";
import { FieldMessage } from "../models/fieldmessage";
import { StorageService } from "../services/storage.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    
    constructor(public storage: StorageService, public alertController: AlertController){
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
    .catch((error, caught) => {
        let errorObj =error;
        if(errorObj.error){
            errorObj = errorObj.error;
        }
        if(!errorObj.status){
           errorObj = JSON.parse(errorObj) 
        }

         
        switch(errorObj.status){
            case 401:
                this.handle401();
                break;
            case 403:
                this.handle403();
                break;
            case 422:
                this.handle422(errorObj);
                break;

            default:
                console.log(errorObj);
                this.handleDefaultError(errorObj);
                break;
        }

        return Observable.throw(errorObj);
    })as any;
    }
    handle422(errorObj: any) {
        let alert = this.alertController.create({
            title: 'Erro de validação.',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
            alert.present();
        
    }
    listErrors(messages: FieldMessage[]): string {
        let s : string = '';
        for(var i=0; i<messages.length; i++){
            s = s + `<p><strong>` + messages[i].fieldName + "</strong> " + messages[i].message + `</p>`;
        }
        return s;
    }
    handleDefaultError(errorObj) {
        let alert = this.alertController.create({
            title: 'Erro' +  errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
            alert.present();
    }
    handle401() {
        let alert = this.alertController.create({
            title: 'Falha de autenticação.',
            message: 'Email ou senha incorretos.',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
            alert.present();
        }
    handle403() {
        this.storage.setLocalUser(null);
    }
      
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};