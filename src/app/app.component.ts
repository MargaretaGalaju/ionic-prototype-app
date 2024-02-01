import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { NetworkDetectionService } from 'src/app/core/services/network-detection.service';
import { ToastController } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import { addIcons } from 'ionicons';
import { chevronBackOutline, filterOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    private readonly networkDetectionService: NetworkDetectionService,
    private storage: Storage,
  ) {
    addIcons({ chevronBackOutline, filterOutline });
  }

  public async ngOnInit(): Promise<void> {
    await this.storage.create();

    this.networkDetectionService.networkChange$.pipe(takeUntil(this.destroy$)).subscribe((network) => {
      console.log(network);
    });
  }

  public ngOnDestroy(): void {
    this.networkDetectionService.removeAllListeners()
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
