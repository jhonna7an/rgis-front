import { MatTableDataSource } from '@angular/material/table';

export class MultiChoiceData {
  public type: string;
  public dataSource: MatTableDataSource<string>;

  constructor(type: string, data: string[]){
    this.type = type;
    this.dataSource = new MatTableDataSource<string>();
    this.dataSource.data = data;
  }
}
