import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonMenu, IonMenuToggle,IonCol, IonToolbar, IonIcon, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
  imports: [CommonModule, IonIcon, IonToolbar, IonButton, IonMenu, IonMenuToggle, IonList, IonItem, IonLabel, IonTitle, IonContent],
  standalone: true
})
export class MenuSidebarComponent  implements OnInit {
  public menuItems = [
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person-outline'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings-outline'
    },
    {
      title: 'Shopping cart',
      url: '/cart',
      icon: 'cart-outline'
    },
  ]
  
  // constructor() { }

  ngOnInit() {}

}
