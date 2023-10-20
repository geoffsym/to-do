import { Observable, Observer } from 'rxjs';

import { AbstractControl } from '@angular/forms';

export function mimeType(
  control: AbstractControl
): Promise<{ [key: string] }> | Observable<{ [key: string] }> {
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
        
    });
    fileReader.readAsArrayBuffer(file);
  });
}
