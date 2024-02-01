import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TabLayoutComponent } from '../tab-layout/tab-layout.component';
import { ApiManagerService } from 'src/app/core/services/api-manager.service';

interface Item {
  label: string;
  id: string;
  request: {
    url: string;
    type:  'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
    data: any;
  }
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, TabLayoutComponent, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],
  providers: [ApiManagerService]
})
export class HomeComponent implements OnInit {
  public items: Item[] = [];

  constructor(
    private apiManager: ApiManagerService,
  ) { }

  public ngOnInit(): void {
    for (let i = 1; i <= 10; i++) {
      this.items.push({
        label: `Title ${i}`,
        id: `${Math.random() * 71893}`,
        request: {
          url: `https://jsonplaceholder.typicode.com/posts/${i}`,
          type: 'PUT',
          data: { context: 'test' }
        }
      })
    }
  }

  public makeRequest(item: Item) {
    this.apiManager.makeRequest(
      item.request.type,
      item.request.url,
      item.request.data,
    );
  }

  checkForUncompletedRequests() {
    this.apiManager.checkForUnCompleteAPI().subscribe(
      (requests) => {
        console.log(requests);
        
      },
      
    )
  }
}
