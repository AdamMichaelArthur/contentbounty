import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';


@Injectable({ providedIn: 'root' })
export class Globals {
    show_notification: boolean = false;
    hide_notification: boolean = true;
    errorMessage: any = "";
    errorNotification: string = 'test';
    expand: boolean = true;
    loggedInUserEmail: any;
    loggedInUsername: any;
    global_loader:boolean = false;
    global_success = false;
    welcome = false;
    isLoadingButton = false
    disableLoadingButton = false
    isLoading = false
    
    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;

    onFirstComponentButtonClick() {
        this.invokeFirstComponentFunction.emit();
    }
}