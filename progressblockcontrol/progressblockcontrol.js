/* ─────────────────────────────────────────
   progressblockcontrol/progressblockcontrol.js
   Контроллер: привязывает DOM-элементы управления
   к ProgressBlockManager. Намеренно отделён от ядра —
   при смене UI достаточно заменить этот файл,
   не трогая progressblock.js
───────────────────────────────────────── */

;(function() {

  // Находим элементы на странице
  var arcWrap       = document.getElementById('arcWrap');
  var card          = document.getElementById('card');
  var valueInput    = document.getElementById('valueInput');
  var animateToggle = document.getElementById('animateToggle');
  var hideToggle    = document.getElementById('hideToggle');

  // Создаём менеджер — передаём ему нужные DOM-узлы
  var manager = new ProgressBlockManager(arcWrap, card);

  // Начальное состояние: дуга пустая (0%)
  manager.setValue(0);

  // ── Value ──
  // Обновляем дугу в реальном времени при каждом нажатии клавиши
  valueInput.addEventListener('input', function() {
    manager.setValue(this.value);
  });

  // При потере фокуса синхронизируем поле с реальным (зажатым) значением.
  // Например: пользователь ввёл 150 → поле покажет 100
  valueInput.addEventListener('blur', function() {
    this.value = manager.getState().value;
  });

  // ── Animate ──
  animateToggle.addEventListener('change', function() {
    manager.setMod('animated', this.checked);
  });

  // ── Hide ──
  hideToggle.addEventListener('change', function() {
    manager.setMod('hidden', this.checked);
  });

  // Экспортируем менеджер глобально для тестирования через консоль браузера:
  // progress.setValue(50)
  // progress.setMod('animated', true)
  // progress.getState()
  window.progress = manager;

}());
