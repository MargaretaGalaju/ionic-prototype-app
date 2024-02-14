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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  imports: [IonButton, IonThumbnail, ReactiveFormsModule, FormsModule, IonTextarea, IonContent, IonMenuToggle, IonTitle, IonMenu, IonHeader, IonToolbar, IonSelect, IonSelectOption, IonDatetimeButton, IonDatetime, IonModal, CommonModule, IonToggle, TabLayoutComponent, IonIcon, IonList, IonItem, IonInput]
})
export class AddProductComponent implements OnInit {
  public categories$: Observable<ChipFilter[]>;
  public form: FormGroup;
  public showStartTime = false;
  public showEndTime = false;
  
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
  ) {
    this.loadingService.isLoading$.next(true);
    this.form = this.formBuilder.group({
      title: '',
      photos: [],
      availableInStock: false,
      startTime: '',
      endTime: '',
      category: '',
      description: '',
      showAs: '',
      location: '',
    })

    // this.form.valueChanges.subscribe((value) => console.log(value))
  }

  public onFormControlChange(value: any, formControlName: string, modalRef?: IonModal): void {
    if (modalRef) {
      console.log(modalRef);
      
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


  openPhotos(): void {
    this.menuCtrl.open('addPhotos');

  }


  closePhotos(): void {
    this.menuCtrl.close('addPhotos');

  }
}
