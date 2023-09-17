function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export default wait;
