import { FormGroup } from '@angular/forms';

//Validación correo
export function correoValido(correo: string):boolean {
    let correoValido = false;
      'use strict';

      var EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

      if (correo.match(EMAIL_REGEX)){
        correoValido = true;
      }
    return correoValido;
}

//Validación contraseñas
export function passwordMatchValidator(g: FormGroup) {
    return g.get('passw').value === g.get('passw2').value ? null : { 'mismatch': true };
}

export function passValido(pass: string): boolean {
    let passValido = false;
    'use strict';

    const CONTRA_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*/]).{8,}$/;

    if (pass.match(CONTRA_REGEX)) {
        passValido = true;
    }
    return passValido;
}