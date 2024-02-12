import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading$ = new BehaviorSubject(false);

  constructor(private loadingCtrl: LoadingController) { 
    this.isLoading$.asObservable().pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((isLoading) => {
      if (isLoading) {
        this.showLoading();
      } else {
        this.loadingCtrl.getTop().then((isLoadingInProgress) => {
          if (isLoadingInProgress) {
            this.hideLoading();
          }
        });
      }
    });
  }

  public async showLoading(message?: string, duration?: number) {
    const loading = await this.loadingCtrl.create({
      message,  duration,
    });

    await loading.present();
  }

  public async hideLoading() {
    await this.loadingCtrl.dismiss();
  }
}

