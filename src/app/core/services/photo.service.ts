import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, GalleryPhoto, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { UserPhoto } from '../interfaces/user-photo.interface';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Injectable()
export class PhotoService {
  public photos: UserPhoto[] = [];
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addNewToGallery(): Promise<void> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);

    this.photos.unshift(savedImageFile);
  }

  public async loadSaved(photos: UserPhoto[]): Promise<void> {
    this.photos = photos;

    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async selectImages(): Promise<void> {
    const images = await Camera.pickImages({});

    if (images?.photos?.length) {
      images?.photos?.forEach(async (image) => {
        const savedImageFile = await this.savePicture(image);

        this.photos.unshift(savedImageFile);
      });
    }
  }

  public async deletePicture(photo: UserPhoto, position: number): Promise<void> {
    this.photos.splice(position, 1);

    const filename = photo.filepath
      .substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  public async deleteAllPictures(): Promise<void> {
    this.photos.forEach(async (photo) => {
      const filename = photo.filepath
        .substr(photo.filepath.lastIndexOf('/') + 1);

      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
    });

    this.photos = [];
  }

  public saveChangesToLocalStorage(storageKey: string): void {
    Preferences.set({
      key: storageKey,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(photo: Photo | GalleryPhoto): Promise<{filepath: any, webviewPath: any, data: any}> {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return this.platform.is('hybrid') ? {
      filepath: savedFile.uri,
      data: base64Data,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
    } : {
      filepath: fileName,
      data: base64Data,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo | GalleryPhoto): Promise<string | Blob> {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })
}
