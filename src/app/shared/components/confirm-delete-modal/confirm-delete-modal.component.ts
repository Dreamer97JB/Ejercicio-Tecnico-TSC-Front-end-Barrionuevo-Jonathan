import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent {
  @Input() productName: string | null = null;
  @Input() visible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancelDelete.emit();
  }
}
