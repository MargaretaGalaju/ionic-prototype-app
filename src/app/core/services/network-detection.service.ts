import { Injectable, OnDestroy } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, Subject } from 'rxjs';
import { Platform } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone';

interface DetailedConnectionStatus extends ConnectionStatus {
  internetSpeed?: string;
}
declare global {
  interface Navigator {
    connection: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NetworkDetectionService implements OnDestroy {
  private networkChange = new BehaviorSubject<DetailedConnectionStatus>({
    connected: false,
    connectionType: 'none',
    internetSpeed: 'none'
  });
  public networkChange$ = this.networkChange.asObservable();
  
  private internetSpeed = 'none';
  
  constructor(
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.internetSpeed = navigator.connection.effectiveType;
      Network.getStatus().then((status) => this.changeNetworkStatus(status));
      this.listenToNetworkStatusChange();
      this.listenToNetworkConnectionChanges()
    });
  }

  public ngOnDestroy(): void {
    this.removeAllListeners();
  }

  public getCurrentStatus(): ConnectionStatus {
    return this.networkChange.getValue();
  }

  public changeNetworkStatus(status: ConnectionStatus | {internetSpeed: string}): void {
    this.networkChange.next({...this.networkChange.getValue(), ...status});
  }

  public listenToNetworkStatusChange(): void {
    Network.addListener('networkStatusChange', (status) => {
      if (this.networkChange.getValue().connected !== status.connected) {
        let message = status.connected ? 'Network is back' : 'Internet disconnected';
        let cssClass = status.connected ? 'success' : 'warning';
        this.showToast(message, cssClass);
      }

      this.networkChange.next(status);      
    });
  }

  // Check the change 'from 4g to 2g' (Slow internet connection detected for example)
  public listenToNetworkConnectionChanges(): void {
    navigator.connection.addEventListener("change", this.updateConnectionStatus.bind(this));
  }

  public updateConnectionStatus(): void {
    const newInternetSpeed = navigator.connection.effectiveType;

    if (this.internetSpeed !== newInternetSpeed) {
      this.changeNetworkStatus({internetSpeed: newInternetSpeed});

      if (newInternetSpeed === '2g') {
        this.showToast('Slow internet detected', 'warning');
      }
    }
  }

  public removeAllListeners(): void {
    Network.removeAllListeners();
    navigator.connection.removeAllListeners();
  }

  private async showToast(message: string, cssClass: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: 'top',
      swipeGesture: 'vertical',
      cssClass: cssClass,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        }
      ]
    });

    await toast.present();
  }

}
