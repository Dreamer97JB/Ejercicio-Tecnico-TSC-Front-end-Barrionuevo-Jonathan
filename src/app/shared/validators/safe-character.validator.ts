import { AbstractControl, ValidationErrors } from '@angular/forms';

export function safeCharacterValidator(allowUrl = false) {
  const safePattern = allowUrl
    ? /^[a-zA-Z0-9:/._%-]+$/
    : /^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ\-()]+$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return safePattern.test(control.value)
      ? null
      : { unsafeChars: true };
  };
}
