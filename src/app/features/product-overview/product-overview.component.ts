import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, filter, map, switchMap, take, tap } from 'rxjs';
import { Product } from 'src/app/core/interfaces/product.interface';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProductApiService } from 'src/app/core/services/product-api.service';
import { TabLayoutComponent } from 'src/app/shared/components/tab-layout/tab-layout.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonChip } from '@ionic/angular/standalone';
import { ToFixedPipe } from 'src/app/core/pipes/to-fixed.pipe';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonChip, ToFixedPipe, TabLayoutComponent],
  encapsulation: ViewEncapsulation.None
})
export class ProductOverviewComponent  implements OnInit {
  public product$: Observable<Product>;

  constructor(
    public loadingService: LoadingService,
    private productService: ProductApiService,
    private route: ActivatedRoute,
  ) {
    this.product$ = this.route.paramMap.pipe(
      tap(()=> this.loadingService.isLoading$.next(true)),
      take(1),
      map((params) => params?.get('id')),
      filter(Boolean),
      switchMap((id) => this.productService.getProductById(id)),
      tap(()=> this.loadingService.isLoading$.next(false)),
    )
   }

  ngOnInit() {

  }

}
