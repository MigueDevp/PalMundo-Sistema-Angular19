import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
  selector: 'app-debtor-passenger',
  imports: [FormsModule, SearchInputComponent],
  templateUrl: './debtor-passenger.component.html',
  styleUrl: './debtor-passenger.component.css'
})
export class DebtorPassengerComponent {

}
