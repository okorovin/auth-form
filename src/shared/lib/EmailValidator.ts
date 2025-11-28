
// Простой вариант проверки.
// При желании можно прикрутить полный https://pdw.ex-parrot.com/Mail-RFC822-Address.html
const emailRegexp = /^['*~a-z0-9_.+!-]+@['*~a-z0-9!-]+\.['*~a-z0-9-!.]+$/i;

export default class EmailValidator {
  min = 0;

  max = 0;

  isValid(str: string) {
    const res = emailRegexp.test(str);

    if (res && this.min) {
      const loginLength = str.split('@')[0].length;

      if (loginLength < this.min) {
        return false;
      }

      if (this.max && loginLength > this.max) {
        return false;
      }
    }

    return res;
  }

  setEmailLengthConstraint(min = 0, max = 0) {
    this.min = min;
    this.max = max;
    return this;
  }
}
