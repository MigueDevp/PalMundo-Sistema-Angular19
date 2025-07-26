import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
  selector: 'app-debtor-passenger',
  imports: [CommonModule, FormsModule, SearchInputComponent],
  templateUrl: './debtor-passenger.component.html',
  styleUrl: './debtor-passenger.component.css'
})
export class DebtorPassengerComponent {

}
