import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../../../components/search-input/search-input.component';

@Component({
  selector: 'app-money-report',
  imports: [FormsModule, CommonModule, SearchInputComponent],
  templateUrl: './money-report.component.html',
  styleUrl: './money-report.component.css'
})
export class MoneyReportComponent {

}
