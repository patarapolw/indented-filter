import { eqDictParser } from "./eqdict";
import { stripIndent } from "./util";

export function createIndentedFilter(tag: string, fn: (s: string, attrs: any) => string) {
  return (text: string) => {
    const replacement: {s: string, attrs: any, start: number, end: number}[] =[];

    let lastPos = 0;
    let currentPos = text.indexOf(tag);

    while (currentPos !== -1) {
      const indentStr = text.substr(lastPos, currentPos - lastPos).match(/(?:^|\n)(.*)$/)
      const indentSize = indentStr ? indentStr[1].length : 0;

      lastPos = currentPos + tag.length;
      let nextSegment = text.substr(lastPos);

      let bracketDepth = 0;
      const eqDictStr: string[] = [];
      for (const c of nextSegment.split("")) {
        if (c === "(") {
          bracketDepth++;
          continue;
        } else if (c === ")") {
          bracketDepth--;
        }

        if (bracketDepth > 0) {
          eqDictStr.push(c);
        } else if (bracketDepth <= 0) {
          break;
        }
      }

      let attrs: any = {};

      if (eqDictStr.length > 0) {
        const eqDict = eqDictStr.join("")
        attrs = eqDictParser(eqDict);

        lastPos += eqDict.length + 2;
        nextSegment = text.substr(lastPos);
      }

      if (nextSegment[0] === ".") {
        let isFirst = true;
        let contents: string[] = [];
        for (const row of nextSegment.split("\n")) {
          if (!isFirst) {
            if (!/\S/.test(row) || /^\s+$/.test(row.substr(0, indentSize + 1))) {
              contents.push(row);
            } else {
              break;
            }
          }

          lastPos += row.length + 1;
          isFirst = false;
        }

        replacement.push({
          s: stripIndent(contents.join("\n")),
          attrs,
          start: currentPos,
          end: lastPos
        });
      } else {
        const row = nextSegment.split("\n")[0];
        lastPos += row.length;

        replacement.push({
          s: stripIndent(row),
          attrs,
          start: currentPos,
          end: lastPos
        })
      }

      currentPos = text.indexOf(tag, lastPos + 1);
    };

    const segments: string[] = [];
    let start = 0;
    for (const r of replacement) {
      segments.push(text.substr(start, r.start - start));
      segments.push(fn(r.s, r.attrs));

      start = r.end;
    }

    segments.push(text.substr(start));

    return segments.join("");
  }
}