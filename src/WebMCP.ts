import { storeManager } from "./StoreManager";
import "./Notification.css";

let notificationContainer: HTMLDivElement | null = null;

function createContainer() {
    if (notificationContainer) return notificationContainer;

    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
    return notificationContainer;
}

export function showAlert(message: string) {
    const container = createContainer();

    const notification = document.createElement("div");
    notification.className = "notification";

    notification.innerHTML = `
        <div class="notification-icon">🔔</div>
        <div class="notification-content">${message}</div>
    `;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add("fade-out");
        setTimeout(() => {
            notification.remove();
            // Optional: remove container if empty
            if (container.children.length === 0) {
                // container.remove();
                // notificationContainer = null;
            }
        }, 500); // Wait for fade-out animation
    }, 5000);
}

export function registerWebMCPTools() {
    if (!navigator.modelContext) {
        return;
    }

    navigator.modelContext.registerTool({
        name: "get_all_store_items",
        description: "Get all available store items",
        inputSchema: {
            type: "object",
            properties: {},
        },
        execute: () => {
            showAlert("get_all_store_items called")
            return storeManager.getItems()
        }
    });

    navigator.modelContext.registerTool({
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
            storeManager.addToCart(id)
            return `Successfully added item ${id} to cart`;
        }
    });

    navigator.modelContext.registerTool({
        name: "display_cart",
        description: "Display the current shopping cart items to user",
        inputSchema: {
            type: "object",
            properties: {},
        },
        execute: () => {
            showAlert("display_cart called");
            storeManager.setCartOpen(true);
            return "Shopping cart is now visible";
        }
    });

    navigator.modelContext.registerTool({
        name: "purchase_cart",
        description: "Purchase the current shopping cart items",
        inputSchema: {
            type: "object",
            properties: {},
        },
        execute: () => {
            showAlert("purchase_cart called");
            storeManager.handleBuy();
            return "Shopping cart purchased successfully";
        }
    });
}




