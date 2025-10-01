import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-badge',
  imports: [],
  templateUrl: './kpi-badge.component.html',
  styleUrl: './kpi-badge.component.css'
})
export class KpiBadgeComponent {
    @Input() amount = 0;
    @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

}
