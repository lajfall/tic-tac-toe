export function min(numbers) {
  if (numbers.length === 0) {
    return NaN;
  }

  let smallest = Infinity;

  for (const number of numbers) {
    if (number < smallest) {
      smallest = number;
    }
  }

  return smallest;
}

export function max(numbers) {
  if (numbers.length === 0) {
    return NaN;
  }

  let biggest = -Infinity;

  for (const number of numbers) {
    if (number > biggest) {
      biggest = number;
    }
  }

  return biggest;
}

export function getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}
