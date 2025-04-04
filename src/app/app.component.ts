import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomSnackbarComponent } from "./shared/components/custom-snackbar/custom-snackbar.component";
import { SnackbarService } from './core/services/snackbar.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CustomSnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'financial-products-app';
  snackbarMessage = '';
  snackbarType: 'success' | 'error' | 'info' = 'info';
  snackbarVisible = false;

  constructor(private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.snackbar.message$.subscribe(msg => this.snackbarMessage = msg);
    this.snackbar.type$.subscribe(type => this.snackbarType = type);
    this.snackbar.visible$.subscribe(vis => this.snackbarVisible = vis);
  }
}
