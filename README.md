# indented-filter

Indented filter maker for Showdown extension / Hyperpug

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
^^name hello
```

```
^^name.
  thank you
    very

  much
```

For more test cases, see [/tests/index.spec.ts](/tests/index.spec.ts)
