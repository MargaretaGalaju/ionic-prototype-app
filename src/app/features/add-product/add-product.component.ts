import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonSelect,IonMenuToggle,IonThumbnail, IonMenu, IonHeader, IonSelectOption, IonList, IonToggle, IonItem, IonIcon, IonInput, IonModal, IonDatetime, IonDatetimeButton, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ChipFilter } from 'src/app/core/interfaces/chip-filter.interface';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductApiService } from 'src/app/core/services/product-api.service';
import { TabLayoutComponent } from 'src/app/shared/components/tab-layout/tab-layout.component';
import { MenuController } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhotoUploadComponent } from 'src/app/core/components/photo-upload/photo-upload.component';
import { Product } from 'src/app/core/interfaces/product.interface';
import { Router } from '@angular/router';

export interface ProductForm {
  title: string;
  photos: never[];
  availableInStock: boolean;
  start: string;
  end: string;
  category: string;
  description: string;
  showAs: string;
  location: string;
}


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  standalone: true,
  imports: [IonButton, PhotoUploadComponent, IonThumbnail, ReactiveFormsModule, FormsModule, IonTextarea, IonContent, IonMenuToggle, IonTitle, IonMenu, IonHeader, IonToolbar, IonSelect, IonSelectOption, IonDatetimeButton, IonDatetime, IonModal, CommonModule, IonToggle, TabLayoutComponent, IonIcon, IonList, IonItem, IonInput]
})
export class AddProductComponent implements OnInit {
  public categories$: Observable<ChipFilter[]>;
  public form: FormGroup;
  public showStartTime = false;
  public showEndTime = false;
  public showAddPhotos = false;

  public busyOptions = [
    {
      title: 'Busy',
      value: 'busy',
    },
    {
      title: 'Free',
      value: 'free',
    },
    {
      title: 'Tentative',
      value: 'tentative',
    },
    {
      title: 'Out of office',
      value: 'out of office',
    }
  ]
  constructor(
    public loadingService: LoadingService,
    private productService: ProductApiService,
    private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loadingService.isLoading$.next(true);

    this.form = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      photos: new FormControl([], Validators.required),
      availableInStock: false,
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      showAs: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });
  }

  public onFormControlChange(value: any, formControlName: string, modalRef?: IonModal): void {
    if (modalRef) {      
      modalRef.dismiss();
    }

    this.form.get(formControlName)?.setValue(value)
  }

  public ngOnInit(): void {
    this.categories$ = this.productService.getProductCategories().pipe(
      map((categories) => categories.map((category) => ({
        id: category,
        title: `${category[0].toUpperCase() + category.slice(1)}`,
      }))),
      tap(() => this.loadingService.isLoading$.next(false)),
    );
  }

  public saveNewProduct(): void {
    const newProduct: Product = {
      id: Math.trunc(Math.random()*10000),
      title: this.form.value.title,
      description: this.form.value.description,
      price: this.form.value.price || 499,
      discountPercentage: 2,
      rating: 4.33,
      stock: 2,
      brand: 'Brand',
      category: this.form.value.category,
      thumbnail: '',
      images: this.form.value.photos.map((photo: any) => photo.data),
      local: true
    };

    this.productService.localProducts.push(newProduct);

    this.router.navigateByUrl('products/'+ newProduct.id);
    this.form.reset();
  }

  public openDescription(): void {
    this.menuCtrl.open('textarea');
  }

  public openShowAs(): void {
    this.menuCtrl.open('showAs');
  }

  public closeShowAs(showAsValue?: string): void {
    this.menuCtrl.close('showAs');

    if (showAsValue) {
      this.onFormControlChange(showAsValue, 'showAs');
    }
  }

  public closeMenu(): void {
    this.menuCtrl.close('textarea');
  }


  public openPhotos(): void {
    this.showAddPhotos = true;
    this.menuCtrl.open('addPhotos');
  }


  public closePhotos(): void {
    this.showAddPhotos = false;
    this.menuCtrl.close('addPhotos');
  }

  public onPhotoSubmit(photos: any): void {
    this.closePhotos();
    
    this.form.get('photos')?.setValue(photos);
  }
}
