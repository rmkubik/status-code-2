function getTagsByCode(code) {
  const codes = code.split(".");

  return {
    head: `<span class="${codes.join(" ")}">`,
    tail: `</span>`,
  };
}

export default getTagsByCode;
