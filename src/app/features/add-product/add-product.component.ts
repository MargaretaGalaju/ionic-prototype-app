import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonSelect, IonSelectOption, IonList, IonToggle, IonItem, IonIcon, IonInput, IonModal, IonDatetime, IonDatetimeButton } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ChipFilter } from 'src/app/core/interfaces/chip-filter.interface';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductApiService } from 'src/app/core/services/product-api.service';
import { TabLayoutComponent } from 'src/app/shared/components/tab-layout/tab-layout.component';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonDatetimeButton, IonDatetime, IonModal, CommonModule, IonToggle, TabLayoutComponent, IonIcon, IonList, IonItem, IonInput]
})
export class AddProductComponent implements OnInit {
  public categories$: Observable<ChipFilter[]>;

  constructor(
    public loadingService: LoadingService,
    private productService: ProductApiService,
  ) {
    this.loadingService.isLoading$.next(true);
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
}
