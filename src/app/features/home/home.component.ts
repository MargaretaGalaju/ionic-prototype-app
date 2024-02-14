import { Component, OnInit } from '@angular/core';
import { IonHeader, IonCard, IonSpinner, IonRippleEffect, IonGrid, IonRow, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonToolbar, IonTitle, IonList, IonButton, IonLabel, IonItem, IonContent, IonIcon ,IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TabLayoutComponent } from '../../shared/components/tab-layout/tab-layout.component';
import { ApiManagerService } from 'src/app/core/services/api-manager.service';
import { ChipsFilterComponent } from 'src/app/shared/components/chips-filter/chips-filter.component';
import { ProductApiService } from 'src/app/core/services/product-api.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { BehaviorSubject, Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ChipFilter } from 'src/app/core/interfaces/chip-filter.interface';
import { addIcons } from 'ionicons';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonIcon, CommonModule, IonGrid, IonSpinner, IonRow, IonRippleEffect, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, ChipsFilterComponent, TabLayoutComponent, IonHeader, IonButton, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],
  providers: [ApiManagerService]
})
export class HomeComponent implements OnInit {
  public items$: Observable<Product[]>;
  public categories$: Observable<ChipFilter[]>;
  public selectedCategories$ = new BehaviorSubject<string[]>(['smartphones', 'laptops']);

  constructor(
    public loadingService: LoadingService,
    private productService: ProductApiService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.categories$ = this.productService.getProductCategories().pipe(
      map((categories) => categories.map((category) => ({
        id: category,
        title: `${category[0].toUpperCase() + category.slice(1)}`,
        selected: this.selectedCategories$.getValue().some((selectedCategory) => selectedCategory === category),
      })),
    ));

    this.items$ = this.selectedCategories$.pipe(
      tap(() => this.loadingService.isLoading$.next(true)),
      switchMap((selectedCategories) => selectedCategories.length ? this.getProductsByCategories(selectedCategories) : this.productService.getAllProducts()),
      tap(() => this.loadingService.isLoading$.next(false)),
    );
  }

  public onCategoryChange(categories: string[]): void {    
    this.selectedCategories$.next(categories);
  }

  public getProductsByCategories(categories: string[]): Observable<Product[]> {
    const requests: Observable<Product[]>[] = categories.map(category => {
      return this.productService.getProductsFromCategory(category);
    });

    return forkJoin(requests).pipe(map((result) => result.reduce((agg, curr) => agg.concat(curr), [])));
  }

  public openProductOverview(id: number): void {
    this.router.navigateByUrl('home/' + id);
  }
}
