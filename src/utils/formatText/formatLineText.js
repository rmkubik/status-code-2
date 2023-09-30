import getTagsByCode from "./getTagsByCode";

/**
 * This is a custom regex function I wrote
 * to emulate some of the niceties of working
 * with Pug syntax on TwilioQuest.
 *
 * It is likely not entirely robust!
 */
const formatLineText = (text) => {
  let output = "";

  // Matches "#[symbol text text text]"
  const regex = /\$\[(.*?)\ (.*?)\]/g;

  let prevIndex = 0;

  for (let match of text.matchAll(regex)) {
    const [wholeMatch, code, content] = match;

    output += text.substring(prevIndex, match.index);
    output += getTagsByCode(code).head;
    output += content;
    output += getTagsByCode(code).tail;
    prevIndex = match.index + wholeMatch.length;
  }

  output += text.slice(prevIndex);

  return output;
};

export default formatLineText;
