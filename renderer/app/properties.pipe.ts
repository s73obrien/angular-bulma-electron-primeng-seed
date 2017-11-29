import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'properties'
})
export class PropertiesPipe implements PipeTransform {

  transform(object: any): any {
    let items = [];
    for (let key in object) {
      items.push({key:key, value: object[key]})
    }
    return items;
  }
}
