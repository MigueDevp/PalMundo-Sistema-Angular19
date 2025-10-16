import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  class?: string;
  template?: TemplateRef<any>;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [CommonModule]
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() showActions: boolean = false;
  @Input() showPagination: boolean = false;
  @Input() emptyMessage: string = '';
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() trackBy: string = 'id'; // Propiedad para trackBy

  @Input() actionsTemplate?: TemplateRef<any>;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() rowSelect = new EventEmitter<any>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  getProperty(item: any, key: string): any {
    return key.split('.').reduce((o, i) => o?.[i], item);
  }

  isSelected(item: any): boolean {
    return false;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  // Método para trackBy mejorado
  trackByFn(index: number, item: any): any {
    return this.trackBy ? this.getProperty(item, this.trackBy) : index;
  }
}