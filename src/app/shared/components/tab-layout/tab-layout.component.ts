import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonRow, IonMenu, IonMenuToggle,IonCol, IonToolbar, IonIcon, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent } from '@ionic/angular/standalone';
import { MenuSidebarComponent } from '../menu-sidebar/menu-sidebar.component';

@Component({
  selector: 'app-tab-layout',
  templateUrl: './tab-layout.component.html',
  styleUrls: ['./tab-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuSidebarComponent,IonRow, IonMenu, IonMenuToggle, IonCol, IonIcon, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],
})
export class TabLayoutComponent implements OnInit {
  @Input({ required: true })
  public tab: any;

  @Input()
  public backUrl: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  public navigateBack(): void {
    this.router.navigateByUrl(this.backUrl);
  }
}
