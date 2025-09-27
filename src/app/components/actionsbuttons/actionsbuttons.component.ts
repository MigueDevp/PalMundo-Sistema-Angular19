import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actionsbuttons',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './actionsbuttons.component.html',
  styleUrl: './actionsbuttons.component.css',
})
export class ActionsbuttonsComponent {
  @Input() type: 'view' | 'edit' | 'delete' = 'view'; // Tipo de acción
  @Input() disabled: boolean = false; // Para deshabilitar en carga
  @Output() actionClick = new EventEmitter<void>(); // Evento al hacer click

  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
}
