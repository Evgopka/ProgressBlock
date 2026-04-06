/* ─────────────────────────────────────────
   progressblock/progressblock.js
   Ядро блока: ProgressBlockManager.
   Содержит только логику — не знает ничего про
   конкретные id или элементы управления на странице.
   Благодаря этому блок можно переиспользовать
   в любом приложении с любым UI.
───────────────────────────────────────── */

;(function() {

  /**
   * Управляет состоянием блока Progress.
   * Принимает DOM-элементы через конструктор — никаких жёстко
   * прописанных id внутри, что делает модуль переиспользуемым.
   *
   * @constructor
   * @param {Element} progressBlock - элемент .arc-wrap (содержит SVG и центральный текст)
   * @param {Element} cardElement   - элемент .card (для состояния Hidden)
   */
  function ProgressBlockManager(progressBlock, cardElement) {
    this._progressBlock = progressBlock;
    this._cardElement   = cardElement;

    this._arcFill   = progressBlock.querySelector('.arc-fill');
    this._arcCenter = progressBlock.querySelector('.arc-center');

    // Динамически вычисляем длину окружности через реальный радиус из SVG.
    // Это важно: если поменять r в HTML, JS подстроится автоматически
    // без правок в коде — не нужно хардкодить число вроде 408.
    var radius = this._arcFill.r.animVal.value;
    this._circumference = Math.PI * radius * 2;

    // Инициализируем dasharray один раз по реальному значению окружности.
    // dashoffset = circumference означает "дуга пустая" (0%),
    // dashoffset = 0 означает "дуга полная" (100%)
    this._arcFill.style.strokeDasharray  = this._circumference;
    this._arcFill.style.strokeDashoffset = this._circumference;

    // Внутреннее состояние блока
    this._state = {
      value:   0,
      animate: false,
      hidden:  false
    };
  }

  /**
   * Универсальный метод изменения модификаторов состояния.
   * Удобен для внешнего управления — не нужно знать конкретные методы.
   *
   * @param {string}  param - 'animated' | 'hidden'
   * @param {boolean} value - true включает состояние, false выключает
   *
   * @example
   * manager.setMod('animated', true);
   * manager.setMod('hidden', false);
   */
  ProgressBlockManager.prototype.setMod = function(param, value) {
    switch (param) {
      case 'animated': this.setAnimate(value); break;
      case 'hidden':   this.setHidden(value);  break;
    }
  };

  /**
   * Устанавливает значение прогресса и перерисовывает дугу.
   * Значение автоматически зажимается в диапазон [0, 100].
   *
   * @param {number} newValue - процент заполнения (0–100)
   *
   * @example
   * manager.setValue(75); // дуга заполнена на 75%
   */
  ProgressBlockManager.prototype.setValue = function(newValue) {
    newValue = Number(newValue);
    if (isNaN(newValue) || newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;

    // Формула: чем больше значение, тем меньше смещение (dashoffset),
    // тем больше видимая дуга
    var offset = ((100 - newValue) / 100) * this._circumference;
    this._arcFill.style.strokeDashoffset = offset;
    this._arcCenter.textContent = Math.round(newValue);

    this._state.value = newValue;
  };

  /**
   * Включает или выключает анимацию вращения блока.
   * Анимация независима от Value — крутится всегда с одной скоростью.
   *
   * @param {boolean} on - true запускает вращение, false останавливает
   *
   * @example
   * manager.setAnimate(true);
   */
  ProgressBlockManager.prototype.setAnimate = function(on) {
    this._state.animate = !!on;
    // Управляем анимацией через CSS-класс, а не через style напрямую —
    // так логика анимации остаётся в CSS, а JS только переключает состояние
    this._progressBlock.classList.toggle('animating', this._state.animate);
  };

  /**
   * Скрывает или показывает блок на странице.
   * Используется opacity + scale вместо display:none,
   * чтобы сохранить плавную CSS-анимацию перехода.
   *
   * @param {boolean} on - true скрывает блок, false показывает
   *
   * @example
   * manager.setHidden(true);
   */
  ProgressBlockManager.prototype.setHidden = function(on) {
    this._state.hidden = !!on;
    this._cardElement.classList.toggle('hidden', this._state.hidden);
  };

  /**
   * Возвращает копию текущего состояния блока.
   * Копия защищает внутреннее состояние от случайных изменений снаружи.
   *
   * @returns {{ value: number, animate: boolean, hidden: boolean }}
   *
   * @example
   * var state = manager.getState();
   * console.log(state.value); // 75
   */
  ProgressBlockManager.prototype.getState = function() {
    return Object.assign({}, this._state);
  };

  // Экспортируем конструктор глобально — его подхватит контроллер
  window.ProgressBlockManager = ProgressBlockManager;

}());
