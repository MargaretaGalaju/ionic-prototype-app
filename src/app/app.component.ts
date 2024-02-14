import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { NetworkDetectionService } from 'src/app/core/services/network-detection.service';
import { Storage } from '@ionic/storage-angular';
import { addIcons } from 'ionicons';
import { logInOutline, camera, pencilOutline, personOutline, cartOutline, chevronBackOutline, filterOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
import { chevronForwardOutline, arrowUpCircleOutline, trashOutline, calendarOutline, checkmarkOutline, eyeOutline, reorderFourOutline, appsOutline, locationOutline, storefrontOutline, starOutline, trendingUpOutline, happyOutline, sadOutline, helpOutline } from 'ionicons/icons';

register();

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  constructor(
    private readonly networkDetectionService: NetworkDetectionService,
    private readonly storage: Storage,
  ) {
    addIcons({ chevronForwardOutline, camera, trashOutline, arrowUpCircleOutline, calendarOutline, checkmarkOutline, eyeOutline, reorderFourOutline, appsOutline, locationOutline, storefrontOutline, starOutline, trendingUpOutline, happyOutline, sadOutline, helpOutline, logInOutline, pencilOutline, personOutline, cartOutline, chevronBackOutline, filterOutline });
  }

  public async ngOnInit(): Promise<void> {
    await this.storage.create();
  }

  public ngOnDestroy(): void {
    this.networkDetectionService.removeAllListeners()
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  
}
