import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftPadFilter',
  pure: false

})
export class LeftPadFilterPipe implements PipeTransform {

    transform(item: string, zeros:number = 8): string {
        return (String('0').repeat(10) + item.toString().replace('.','')).substr((10 * -1), 10);
    }

}

