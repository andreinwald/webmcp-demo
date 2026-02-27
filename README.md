# WebMCP Demo
https://andreinwald.github.io/webmcp-demo

<img src="./preview.png" height="300px">

WebMCP requires an "instance" of website that has JavaScript runtime and likely a DOM tree. In other words, the browser opened the site in some form. It's designed for agentic browsers (like Google Chrome), not agents "outside" of browsers. Classic MCP or API should fit last ones better.

## Requirements
- Google Chrome version 146 or higher
- Enable "WebMCP" in chrome://flags
- Browser extension to call actions [chromewebstore](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd)

## React
Actions registered in [DemoStore.tsx](./src/DemoStore.tsx)

## Action example
```typescript
  useRegisterMCP({
    name: "add_to_cart",
    description: "Add an item to the shopping cart",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The ID of the item to add to the cart"
        }
      },
      required: ["id"]
    },
    execute: ({ id }: { id: number }) => {
      showAlert("add_to_cart called")
      addToCart(id)
      return `Successfully added item ${id} to cart`
    }
  })
```

## Read more
- https://developer.chrome.com/blog/webmcp-epp
- https://webmachinelearning.github.io/webmcp
