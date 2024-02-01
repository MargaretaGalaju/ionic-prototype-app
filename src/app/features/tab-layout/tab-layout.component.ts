import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonRow, IonCol, IonToolbar, IonIcon, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab-layout',
  templateUrl: './tab-layout.component.html',
  styleUrls: ['./tab-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, IonRow, IonCol, IonIcon, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],
})
export class TabLayoutComponent implements OnInit {
  @Input()
  public tab: any;

  constructor() { }

  ngOnInit() {}

}
