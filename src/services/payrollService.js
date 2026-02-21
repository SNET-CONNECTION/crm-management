function normalizePattern(input = '') {
  return input.trim().replace(/\s+/g, '|').replace(/\|+/g, '|');
}

function calculateTotalPcs(pattern) {
  return normalizePattern(pattern)
    .split('|')
    .map((v) => Number(v) || 0)
    .reduce((acc, v) => acc + v, 0);
}

function calculateSalary({ totalPcs, productPrice, ownerRatio, employeeRatio }) {
  const denominator = ownerRatio + employeeRatio;
  if (denominator <= 0) return 0;
  return (totalPcs * productPrice / denominator) * employeeRatio;
}

module.exports = { normalizePattern, calculateTotalPcs, calculateSalary };
