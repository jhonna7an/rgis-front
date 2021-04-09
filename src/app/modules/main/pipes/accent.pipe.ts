import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accent'
})
export class AccentPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace("Á", "A")
                .replace("É", "E")
                .replace("Í", "I")
                .replace("Ó", "O")
                .replace("Ú", "U")
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u");
  }

}
