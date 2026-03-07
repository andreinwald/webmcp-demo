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

## WebMCP in React components
For React, a more typical approach is to register tools directly in components, so the following wrapper is used:

```typescript
export function useRegisterMCP(props: {
    name: string;
    description: string;
    inputSchema: any;
    execute: (args?: any) => any;
}) {
    useEffect(() => {
        navigator.modelContext.registerTool(props);
        return () => {
            navigator.modelContext.unregisterTool(props.name);
        };
    }, []);
}
```

Then tools registered close to component and corresponding hooks this way:
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

See more in [DemoStore.tsx](./src/DemoStore.tsx)


## Read more
- https://github.com/GoogleChromeLabs/webmcp-tools
- https://developer.chrome.com/blog/webmcp-epp
- https://webmachinelearning.github.io/webmcp
