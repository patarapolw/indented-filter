import { createIndentedFilter } from "../src/index";
import assert from "assert";

const indentedFilter = createIndentedFilter("^^name", (s, attrs) => {
  return `<!-- ${JSON.stringify(attrs)}: ${s} -->`;
});

describe("createIndentedFilter", () => {
  [
    {q: "", name: "blank", expected: ""},
    {q: "^^name", name: "no children", expected: '<!-- {}:  -->'},
    {q: "^^name hello", name: "single line", expected: '<!-- {}: hello -->'},
    {q: "^^name.hello", name: "post dot throw away1", expected: '<!-- {}:  -->'},
    {q: "^^name. hello", name: "post dot throw away2", expected: '<!-- {}:  -->'},
    {q: `
    ^^name
      hello`, name: "no dot but indented", expected: '\n    <!-- {}:  -->\n      hello'},
    {q: `
    ^^name.
      hello
        very`, name: "dot and indented", expected: '\n    <!-- {}: hello\n  very -->'},
    {q: `
    ^^name.
    hello`, name: "dot but not indented", expected: '\n    <!-- {}:  -->    hello'},
    {q: `
    ^^name.
  hello`, name: "dot but negative indent", expected: '\n    <!-- {}:  -->  hello'},
    {q:`
    ^^name(a=b c).
      hello
  
      goodbye
        very
  yes`, name: "Poor indent empty line", test: (result: string) => {
    assert(result.endsWith(">  yes"), result);
  }}
  ].forEach((el) => {
    let q: string;
    let name: string = "parse";
    let test: any = null;
    let expected: string | undefined = undefined;
    if (typeof el === "object") {
      q = el.q,
      name = el.name || name;
      test = el.test;
      expected = el.expected;
    } else {
      q = el;
      name = el;
    }

    it(name, () => {
      const r = indentedFilter(q);
      if (test) {
        test(r);
      } else if (expected !== undefined) {
        assert.equal(r, expected, r);
      } else {
        console.dir(r);
      }
    })
  });
});