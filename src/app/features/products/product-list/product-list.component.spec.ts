import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../core/services/product.service';
import { of, throwError, Observable } from 'rxjs';
import { FinancialProduct } from '../../../core/models/financial-product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef, QueryList } from '@angular/core';
import * as validators from '../../../shared/validators/safe-character.validator';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let routerMock: jest.Mocked<Router>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'inv-fondo7',
      name: 'Fondo de Inversión Segura7',
      description: 'Fondo diversificado de bajo riesgo para inversión a largo plazo',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-platinum-400x225.jpg',
      date_release: new Date('2024-01-15'),
      date_revision: new Date('2025-01-15'),
    },
    {
      id: 'inv-fondo8',
      name: 'Fondo de Inversión Tech8',
      description: 'Fondo diversificado de alto riesgo para inversión tecnológica',
      logo: '',
      date_release: new Date('2024-03-01'),
      date_revision: new Date('2025-03-01'),
    },
  ];

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn((): Observable<FinancialProduct[]> => of(mockProducts)),
      getProductById: jest.fn((): Observable<FinancialProduct> => of(mockProducts[0])),
      updateProduct: jest.fn(),
      createProduct: jest.fn(),
      verifyId: jest.fn(),
      deleteProduct: jest.fn((): Observable<{ message: string }> => of({ message: 'Deleted' })),
      baseUrl: '',
      http: {},
    } as unknown as jest.Mocked<ProductService>;

    routerMock = {
      navigate: jest.fn((_commands: string[]): Promise<boolean> => Promise.resolve(true)),
      events: of(new Event('')),
      routerState: {},
      url: '',
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, CommonModule, FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { queryParams: {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.allProducts.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('should filter products by name', () => {
    component.filterTerm = 'Tech8';
    component.onSearchChange();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('inv-fondo8');
  });

  it('should return paginated products correctly', () => {
    component.pageSize = 1;
    component.currentPage = 2;
    const result: FinancialProduct[] = component.paginatedProducts;
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('inv-fondo8');
  });

  it('should handle empty search', () => {
    component.filterTerm = '';
    component.onSearchChange();
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should set currentPage to 1 on page size change', () => {
    component.currentPage = 5;
    component.onPageSizeChange();
    expect(component.currentPage).toBe(1);
  });

  it('should show total results', () => {
    expect(component.totalResults).toBe(2);
  });

  it('should handle service error gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((..._args: unknown[]): void => {
    });
    productServiceMock.getProducts.mockReturnValueOnce(throwError(() => new Error('error')));
    component.ngOnInit();
    expect(component.loading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error loading products', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should toggle menu correctly', () => {
    component.menuOpenId = null;
    component.toggleMenu('prod-01');
    expect(component.menuOpenId).toBe('prod-01');

    // Si se llama nuevamente con el mismo id, se cierra
    component.toggleMenu('prod-01');
    expect(component.menuOpenId).toBeNull();

    // Si se abre otro, se cambia el menú abierto
    component.menuOpenId = 'prod-01';
    component.toggleMenu('prod-02');
    expect(component.menuOpenId).toBe('prod-02');
  });

  it('should return true or false for isMenuOpen correctly', () => {
    component.menuOpenId = 'prod-01';
    expect(component.isMenuOpen('prod-01')).toBe(true);
    expect(component.isMenuOpen('prod-02')).toBe(false);
  });

  it('should close menu on document click if click is outside menus and not on a button', () => {
    component.menus = {
      some: (_fn: (menu: ElementRef) => boolean): boolean => false,
    } as QueryList<ElementRef>;
    component.menuOpenId = 'prod-01';

    const outsideElement: HTMLElement = document.createElement('div');
    const event: MouseEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement, configurable: true });
    component.onDocumentClick(event);
    expect(component.menuOpenId).toBeNull();
  });

  it('should not close menu on document click if click is inside a menu', () => {
    const menuElement: HTMLElement = document.createElement('div');
    const insideElement: HTMLElement = document.createElement('span');
    menuElement.appendChild(insideElement);
    const fakeMenu: ElementRef = { nativeElement: menuElement };
    component.menus = {
      some: (_fn: (menu: ElementRef) => boolean): boolean => _fn(fakeMenu),
    } as QueryList<ElementRef>;
    component.menuOpenId = 'prod-01';

    const event: MouseEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: insideElement, configurable: true });
    component.onDocumentClick(event);
    expect(component.menuOpenId).toBe('prod-01');
  });

  it('should not close menu on document click if click is on a button', () => {
    component.menus = {
      some: (_fn: (menu: ElementRef) => boolean): boolean => false,
    } as QueryList<ElementRef>;
    component.menuOpenId = 'prod-01';

    const buttonElement: HTMLElement = document.createElement('button');
    const event: MouseEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: buttonElement, configurable: true });
    component.onDocumentClick(event);
    expect(component.menuOpenId).toBe('prod-01');
  });

  it('should navigate on edit and reset menuOpenId', () => {
    const navigateSpy = routerMock.navigate;
    component.menuOpenId = 'prod-01';
    component.onEdit('prod-01');
    expect(component.menuOpenId).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/editar', 'prod-01']);
  });

  it('should set modal properties on delete', () => {
    component.menuOpenId = 'prod-01';
    component.onDelete('prod-01', 'Producto Test');
    expect(component.menuOpenId).toBeNull();
    expect(component.selectedProductId).toBe('prod-01');
    expect(component.selectedProductName).toBe('Producto Test');
    expect(component.showDeleteModal).toBe(true);
  });

  it('should not call deleteProduct if no selectedProductId in confirmDelete', () => {
    const deleteSpy = productServiceMock.deleteProduct;
    component.selectedProductId = null;
    component.confirmDelete();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should handle confirmDelete success', () => {
    component.allProducts = [...mockProducts];
    component.filteredProducts = [...mockProducts];
    component.selectedProductId = 'inv-fondo7';
    component.showDeleteModal = true;
    component.menuOpenId = 'inv-fondo7';

    const snackbarSpy = jest
      .spyOn(component['snackbar'], 'show')
      .mockImplementation((_msg: string, _type: string): void => { });
    jest.spyOn(productServiceMock, 'deleteProduct').mockReturnValueOnce(
      of({ message: 'Deleted successfully' })
    );
    component.confirmDelete();

    expect(
      component.filteredProducts.find((p: FinancialProduct) => p.id === 'inv-fondo7')
    ).toBeUndefined();
    expect(
      component.allProducts.find((p: FinancialProduct) => p.id === 'inv-fondo7')
    ).toBeUndefined();
    expect(component.showDeleteModal).toBe(false);
    expect(component.menuOpenId).toBeNull();
    expect(snackbarSpy).toHaveBeenCalledWith('Producto eliminado correctamente', 'success');
  });

  it('should handle confirmDelete error', () => {
    component.selectedProductId = 'inv-fondo7';
    const error: Error = new Error('Delete failed');
    const snackbarSpy = jest
      .spyOn(component['snackbar'], 'show')
      .mockImplementation((_msg: string, _type: string): void => { });
    jest.spyOn(productServiceMock, 'deleteProduct').mockReturnValueOnce(
      throwError(() => error)
    );
    component.confirmDelete();
    expect(snackbarSpy).toHaveBeenCalledWith('Error al eliminar producto: ' + error.message, 'error');
  });

  it('should reset modal properties on cancelDelete', () => {
    component.showDeleteModal = true;
    component.selectedProductId = 'inv-fondo7';
    component.selectedProductName = 'Producto Test';
    component.cancelDelete();
    expect(component.showDeleteModal).toBe(false);
    expect(component.selectedProductId).toBeNull();
    expect(component.selectedProductName).toBeNull();
  });

  it('should clear filteredProducts when search input is unsafe', () => {
    const safeValidatorSpy = jest
      .spyOn(validators, 'safeCharacterValidator')
      .mockReturnValue(() => ({ unsafeChars: true }));
    component.filterTerm = 'unsafe';
    component.onSearchChange();
    expect(component.filteredProducts.length).toBe(0);
    safeValidatorSpy.mockRestore();
  });

  it('should call preventDefault on unsafe key in preventUnsafeChars', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown', { key: '%' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    component.preventUnsafeChars(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault on safe key in preventUnsafeChars', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    component.preventUnsafeChars(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
