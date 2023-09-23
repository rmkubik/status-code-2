function isInt(string) {
  const result = parseInt(string, 10);

  return !isNaN(result);
}

export default isInt;
