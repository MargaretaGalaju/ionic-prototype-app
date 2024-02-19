import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonToolbar, IonButton, IonLabel, IonItem, IonList } from "@ionic/angular/standalone";
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto } from '../../interfaces/user-photo.interface';


@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [PhotoService],
  imports: [IonList, IonItem, IonLabel, IonButton, IonToolbar, IonImg, IonCol, IonRow, IonGrid, IonContent, IonFab, IonFabButton, IonIcon, CommonModule]
})
export class PhotoUploadComponent implements OnInit {
  @Input()
  public photos: UserPhoto[];

  @Output()
  public onClose = new EventEmitter<void>();

  @Output()
  public onSubmit = new EventEmitter<UserPhoto[]>();

  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public cdr: ChangeDetectorRef
  ) { }

  public async ngOnInit(): Promise<void> {
    if (this.photos?.length) {
      this.photoService.loadSaved(this.photos);
    }
  }

  public addPhotoToGallery(): void {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number): Promise<void> {
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

  public selectImages(): void {
    this.photoService.selectImages();
  }

  public submit(): void {
    this.onSubmit.emit(this.photoService.photos);
    
    // if (this.storageKey) {
    //   this.photoService.saveChangesToLocalStorage(this.storageKey);
    // }

    this.photoService.photos = [];
    // this.photoService.deleteAllPictures();
  }

  public cancel(): void {
    this.onClose.emit();
    this.photoService.photos = [];

    // this.photoService.deleteAllPictures();
  }
}
