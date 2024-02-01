import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, searchOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private readonly router: Router,
  ) {
    addIcons({ homeOutline, searchOutline, settingsOutline });
  }

  public navigateTo(url: string): void {
    // replaceUrl necessary for ionic navigation to trigger ngOnDestroy of the component
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}
