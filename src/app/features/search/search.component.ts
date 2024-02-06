import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TabLayoutComponent } from '../../shared/components/tab-layout/tab-layout.component';
import { ApiManagerService } from 'src/app/core/services/api-manager.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, TabLayoutComponent, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],

})
export class SearchComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
