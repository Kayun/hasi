export class Calculator {

  constructor(element) {
    this.element = element;
    this.memoryIndicator = element.querySelector('.js-calculator-memory');
    this.display = element.querySelector('.js-calculator-display');
    this.keyboard = element.querySelector('.js-calculator-keyboard');
    this.capacity = 10;
    this.isImputMode = true;
    this.operand = {
      left: null,
      right: null
    }
    this.currentAction = null;
    this.memory = null

    console.log(this.memoryIndicator);

    const BUTTON_TYPES = {
      input: 0,
      action: 1,
      service: -1
    }

    const SERVICE_TYPE = {
      C: this.clear.bind(this),
      CE: this.clearEntry.bind(this),
      backspace: this.backspace.bind(this),
      '=': this.result.bind(this),
      MC: this.memoryClear.bind(this),
      MS: this.memorySave.bind(this),
      MR: this.memoryReturn.bind(this),
      'M+': this.memoryAdd.bind(this)
    }

    const ACTION_TYPE = {
      '/': this.division.bind(this),
      '*': this.multiplication.bind(this),
      '-': this.subtraction.bind(this),
      '+': this.addition.bind(this),
      'sqrt': this.sqrt.bind(this),
      '%': this.remainder.bind(this),
      '1/x': this.fraction.bind(this)
    }

    const SINGLE_OPERATION = ['sqrt', '1/x'];

    let onClick = event => {
      let button = event.target;
      if (!button.closest('.calculator__button')) return false;

      let type = +button.dataset.type;
      let value = button.dataset.value

      switch (type) {
        case BUTTON_TYPES.service:
          SERVICE_TYPE[value]();
          break;

        case BUTTON_TYPES.input:
          this.input(value);
          break;

        case BUTTON_TYPES.action:
          this.action(ACTION_TYPE[value], SINGLE_OPERATION.indexOf(value) !== -1);
          break;
      }
    }

    this.keyboard.addEventListener('click', onClick);

    this.destroy = () => {
      this.keyboard.removeEventListener('click', onClick);
    }
  }

  input(value) {
    if (value === null) return false;

    if ((this.display.value === '0' || !this.isImputMode) && value !== '.' && value !== '±') {
      this.display.value = '';
      this.isImputMode = true;
    }

    let displayValue = this.display.value;

    if (value === '.' && (displayValue === '0' || /\./.test(displayValue))) {
      return false;
    }
    if (value === '±') {
      this.display.value = -parseFloat(displayValue);
      return false;
    }

    this.display.value = displayValue + value;
  }

  action(fn, isSingle = false) {
    this.operand.left = parseFloat(this.display.value);

    if (isSingle) {
      this.display.value = fn();
      return false;
    }

    this.currentAction = fn;
    this.isImputMode = false;
  }

  division() {
    let { left, right } = this.operand;
    return left / right;
  }

  addition() {
    let { left, right } = this.operand;
    return left + right;
  }

  multiplication() {
    let { left, right } = this.operand;
    return left * right;
  }

  subtraction() {
    let { left, right } = this.operand;
    return left - right;
  }

  fraction() {
    let { left } = this.operand;
    return 1 / left;
  }

  sqrt() {
    let { left } = this.operand;
    return Math.sqrt(left);
  }

  remainder() {
    let { left, right } = this.operand;
    return left % right;
  }

  clear() {
    this.display.value = 0;
    this.currentAction = null
    this.operand.left = null;
    this.operand.right = null;
  }

  clearEntry() {
    this.display.value = 0;
  }

  backspace() {
    this.display.value = this.display.value.slice(0, -1);
    if (this.display.value === '' || this.display.value === '-') {
      this.display.value = 0;
    }
  }

  memoryClear() {
    this.memory = null;
    this.indicatorVisibility(false);
  }

  memorySave() {
    this.memory = parseFloat(this.display.value);
    this.indicatorVisibility(true);
  }

  memoryReturn() {
    this.display.value = 0;
    this.input(this.memory);
  }

  memoryAdd() {
    this.memory += parseFloat(this.display.value);
    this.indicatorVisibility(true);
  }

  indicatorVisibility(isVisible) {
    console.log(this.memoryIndicator.style);
    this.memoryIndicator.style.display = isVisible ? 'block' : 'none';
  }

  result() {
    if (!this.currentAction) {
      return false;
    }
    this.operand.right = parseFloat(this.display.value);

    this.display.value = this.currentAction();
    this.isImputMode = true;
    this.currentAction = null
  }

}
