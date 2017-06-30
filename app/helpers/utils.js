const sum = (numbers) => {
  return numbers.reduce((current, num) => {
    return current + num;
  });
}

const mean = (numbers) => {
  if(!numbers || numbers.length == 0) {
    console.log("mean: No arguments passed.");
    return 0;
  }

  const total = sum(numbers);
  return (total / numbers.length) ;
}

const stdDeviation = (numbers) => {
  if(!numbers || numbers.length == 0) {
    console.log("stdDeviation: No arguments passed.");
    return 0;
  }

  const _mean = mean(numbers);
  let total = 0;
  for(let i  = 0; i < numbers.length; i++) {
    total += Math.pow((numbers[i] - _mean), 2);
  }

  return Math.sqrt(total / numbers.length);
};

module.exports = {
  sum,
  mean,
  stdDeviation
};
