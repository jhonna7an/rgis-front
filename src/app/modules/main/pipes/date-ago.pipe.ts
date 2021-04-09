import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {

  transform(value: Date): string {
    const today = moment();
    let dif = today.diff(value, 'years');

    if (dif > 0) {
      return `${dif} años`;
    }
    else{
      dif = today.diff(value, 'months');
      if (dif > 0) {
        return `${dif} meses`;
      }
      else{
        dif = today.diff(value, 'days');
        if (dif > 0) {
          return `${dif} días`;
        }
        else{
          dif = today.diff(value, 'hours');
          if (dif > 0) {
            return `${dif} horas`;
          }
          else{
            dif = today.diff(value, 'minutes');
            if (dif > 0) {
              return `${dif} minutos`;
            }
            else{
              dif = today.diff(value, 'seconds');
              return `${dif} segundos`;
            }
          }
        }
      }
    }
  }
}
