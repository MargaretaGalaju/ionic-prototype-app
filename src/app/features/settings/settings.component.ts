import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonThumbnail, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent, IonImg, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TabLayoutComponent } from '../../shared/components/tab-layout/tab-layout.component';
import { ApiManagerService } from 'src/app/core/services/api-manager.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, GalleryPhoto, Photo } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';


const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [IonIcon, IonImg, CommonModule, IonThumbnail, TabLayoutComponent, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],

})
export class SettingsComponent {
  
}
