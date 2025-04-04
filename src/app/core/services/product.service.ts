import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { FinancialProduct } from '../models/financial-product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = '/bp/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<FinancialProduct[]> {
    return this.http.get<{ data: FinancialProduct[] }>(this.baseUrl).pipe(
      // Extract only the data array
      map(response => response.data)
    );
  }

  getProductById(id: string): Observable<FinancialProduct> {
    return this.http.get<FinancialProduct>(`${this.baseUrl}/${id}`).pipe(
      tap(product => console.log('GET /products/:id response:', product))
    );
  }

  updateProduct(product: FinancialProduct): Observable<{ message: string; data: FinancialProduct }> {
    return this.http.put<{ message: string; data: FinancialProduct }>(
      `${this.baseUrl}/${product.id}`,
      product
    );
  }

  createProduct(product: FinancialProduct): Observable<{ message: string; data: FinancialProduct }> {
    return this.http.post<{ message: string; data: FinancialProduct }>(this.baseUrl, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }

}
