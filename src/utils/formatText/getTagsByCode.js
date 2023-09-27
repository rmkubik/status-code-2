function getTagsByCode(code) {
  return {
    head: `<span class="${code}">`,
    tail: `</span>`,
  };
}

export default getTagsByCode;
