
export function validarCorreo(email: string):boolean {
    let correoValido = false;
      'use strict';

      var EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

      if (email.match(EMAIL_REGEX)){
        correoValido = true;
      }
    return correoValido;
}