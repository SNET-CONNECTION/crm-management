document.addEventListener('DOMContentLoaded', () => {
  const qtyPattern = document.getElementById('qtyPattern');
  if (qtyPattern) {
    qtyPattern.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        const start = qtyPattern.selectionStart;
        const end = qtyPattern.selectionEnd;
        qtyPattern.value = `${qtyPattern.value.slice(0, start)}|${qtyPattern.value.slice(end)}`;
        qtyPattern.selectionStart = qtyPattern.selectionEnd = start + 1;
      }
    });
  }
});
