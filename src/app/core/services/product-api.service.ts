import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';

export interface HttpProductResponse {
  limit: number;
  products: Product[]
  skip: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  public localProducts: Product[] = [];

  constructor(
    private httpClient: HttpClient,
  ) { }



  public getProductById(id: string): Observable<Product> {
    const localProduct = this.localProducts.find((product) => `${product.id}` === id);

    if (localProduct) {
      return of(localProduct).pipe(delay(1000));
    }

    return this.httpClient.get<Product>(`https://dummyjson.com/products/${id}`);
  }

  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<HttpProductResponse>('https://dummyjson.com/products').pipe(map((result) => result.products));
  }

  public getProductCategories(): Observable<string[]> {
    return this.httpClient.get<string[]>('https://dummyjson.com/products/categories');
  }

  public getProductsFromCategory(category: string): Observable<Product[]> {
    return this.httpClient.get<HttpProductResponse>(`https://dummyjson.com/products/category/${category}`).pipe(map((result) => result.products));
  }
}
