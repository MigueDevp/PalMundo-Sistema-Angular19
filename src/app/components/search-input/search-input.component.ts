import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
@Input() placeholder: string = 'Buscar...';
faSearch = faSearch;
}
