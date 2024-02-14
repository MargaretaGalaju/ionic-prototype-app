import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg } from "@ionic/angular/standalone";
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto } from '../../interfaces/user-photo.interface';


@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
  standalone: true,
  imports: [IonImg, IonCol, IonRow, IonGrid, IonContent, IonFab, IonFabButton, IonIcon, CommonModule]
})
export class PhotoUploadComponent implements OnInit {

  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
  ) { }

  public async ngOnInit() {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
  }
}
