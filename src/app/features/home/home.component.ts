import { Component, OnInit } from '@angular/core';
import { IonHeader, IonCard, IonRippleEffect, IonGrid, IonRow, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonToolbar, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TabLayoutComponent } from '../../shared/components/tab-layout/tab-layout.component';
import { ApiManagerService } from 'src/app/core/services/api-manager.service';
import { ChipsFilterComponent } from 'src/app/shared/components/chips-filter/chips-filter.component';
import { ProductApiService } from 'src/app/core/services/product-api.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { BehaviorSubject, Observable, forkJoin, map, switchMap } from 'rxjs';
import { ChipFilter } from 'src/app/core/interfaces/chip-filter.interface';
import { chevronForwardOutline, starOutline, trendingUpOutline, happyOutline, sadOutline, helpOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule, IonGrid, IonRow, IonRippleEffect, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, ChipsFilterComponent, TabLayoutComponent, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],
  providers: [ApiManagerService]
})
export class HomeComponent implements OnInit {
  public items$: Observable<Product[]>;
  public categories$: Observable<ChipFilter[]>;
  public selectedCategories$ = new BehaviorSubject<string[]>(['smartphones', 'groceries']);

  constructor(
    private productService: ProductApiService
  ) {
    this.categories$ = this.productService.getProductCategories().pipe(
      map((categories) => categories.map((category) => ({
        id: category,
        title: `${category[0].toUpperCase() + category.slice(1)}`,
        selected: this.selectedCategories$.getValue().some((selectedCategory) => selectedCategory === category),
      })),
    ));

    this.items$ = this.selectedCategories$.pipe(
      switchMap((selectedCategories) => selectedCategories.length ? this.getProductsByCategories(selectedCategories) : this.productService.getAllProducts()),
    );

    addIcons({ chevronForwardOutline, starOutline, trendingUpOutline, happyOutline, sadOutline, helpOutline });
  }

  public ngOnInit(): void {

    this.categories$.pipe()
  }

  public onCategoryChange(categories: string[]): void {
    console.log(categories);
    
    this.selectedCategories$.next(categories);
  }

  public getProductsByCategories(categories: string[]): Observable<Product[]> {
    const requests: Observable<Product[]>[] = categories.map(category => {
      return this.productService.getProductsFromCategory(category);
    });

    return forkJoin(requests).pipe(map((result) => result.reduce((agg, curr) => agg.concat(curr), [])));
  }

  // public makeRequest(item: Product) {

  // }

  // private getProductCategories(): void {
  //   this.productService.getProductCategories();
  // }
}
