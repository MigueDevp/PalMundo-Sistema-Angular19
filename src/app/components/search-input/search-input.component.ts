import { Component, Input, EventEmitter, Output } from '@angular/core';
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
@Input() value: string = '';
@Output() valueChange = new EventEmitter<string>();
@Output() search = new EventEmitter<void>();

onInput(event: any) {
    this.value = event.target.value;
    this.valueChange.emit(this.value);
    this.search.emit();
  }

  onButtonClick() {
    this.search.emit();
  }
  
faSearch = faSearch;
}
