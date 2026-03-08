# Shoe store WebMCP Demo for Google Chrome
https://andreinwald.github.io/webmcp-demo

<img src="./preview.png" height="300px">

WebMCP requires an "instance" of website that has JavaScript runtime and likely a DOM tree. In other words, the browser opened the site in some form. It's designed for agentic browsers (like Google Chrome).

## How to test
Right now for testing you need:
- Google Chrome version 146 or higher
- Enable "WebMCP" in chrome://flags
- Browser extension to call actions [chromewebstore](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd)

Example Prompt:
```
Suggest the 3 best pairs of soccer shoes (foot size 45) available on this site. Add (one of suggestions) to cart and complete purchase.
```
## Registering tools
It's very handy istead of manually writing [JSON schema format](https://json-schema.org) for `inputSchema` WebMCP param, to use validator like Zod, that generates JSON schema for you.

This repo has helper function [registerMCP](./src/useRegisterMCP.ts) that allows you build ZOD schema which way easier and also doin validation of input from LLM model.
Usage:
```typescript
registerMCP({
    name: "filter_by_brand",
    description: "Filter products by brand",
    paramsSchema: z.object({
      brand: z.string().describe("The brand to filter by")
    }),
    execute: ({ brand }: { brand: string }) => {
      setSelectedBrand(brand)
      return `Successfully filtered by brand ${brand}`
    }
})
```

## Registering tools in React components
For React, a more typical approach is to register tools directly in components, so its [useRegisterMCP](./src/useRegisterMCP.ts) wrapper created also:

```typescript
useRegisterMCP({
    name: "add_to_cart",
    description: "Add an item to the shopping cart",
    paramsSchema: z.object({
      id: z.number().describe("The ID of the item to add to the cart")
    }),
    execute: ({ id }: { id: number }) => {
      addToCart(id)
      return `Successfully added item ${id} to cart`
    }
})
```


See more examples in [DemoStore.tsx](./src/DemoStore.tsx)


## Read more
- https://github.com/GoogleChromeLabs/webmcp-tools
- https://developer.chrome.com/blog/webmcp-epp
- https://webmachinelearning.github.io/webmcp
