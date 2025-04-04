import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  message$ = new BehaviorSubject<string>('');
  type$ = new BehaviorSubject<'success' | 'error' | 'info'>('info');
  visible$ = new BehaviorSubject<boolean>(false);

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500) {
    this.message$.next(message);
    this.type$.next(type);
    this.visible$.next(true);

    timer(duration).subscribe(() => {
      this.visible$.next(false);
    });
  }
}
