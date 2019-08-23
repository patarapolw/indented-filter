# indented-filter

Indented filter maker for [Showdown](https://github.com/showdownjs/showdown) extension / [Hyperpug](https://github.com/patarapolw/hyperpug)

## Installation

```
npm i indented-filter
```

## Usage

```typescript
import { createIndentedFilter } from "indented-filter";
const filterFn = createIndentedFilter("^^x1", (coveredText, attrs) => {
  return customFn(coveredText, attrs)
});
const showdownX1Extension = {
  type: "lang",
  filter: filterFn
};
```

Example matched cases,

```
^^x1 hello
```

```
^^x1(source="github") hello
```

```
![](^^x1(source="github") hello^^)
```

```
^^x1(source="github").
  thank you
    very

  much
```

For more test cases, see [/tests/index.spec.ts](/tests/index.spec.ts)

For my use case, see, <https://github.com/patarapolw/zhdiary/blob/master/src/plugins/showdown-ext.js#L23>

For more information about custom [Showdown](https://github.com/showdownjs/showdown) extensions, see <https://github.com/showdownjs/showdown/wiki/Extensions>.
