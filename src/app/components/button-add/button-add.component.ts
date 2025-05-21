import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-add',
  imports: [FontAwesomeModule],
  templateUrl: './button-add.component.html',
  styleUrl: './button-add.component.css'
})
export class ButtonAddComponent {
faPlus = faPlus;
}
