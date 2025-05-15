import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transport',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css'
})
export class TransportComponent {

}
