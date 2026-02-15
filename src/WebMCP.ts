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
            console.log("display_cart called");
            showAlert("display_cart called");
            storeManager.setCartOpen(true);
            return {
                content: [
                    {
                        type: "text",
                        text: "The shopping cart has been opened and is now visible to the user."
                    }
                ]
            };
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

    navigator.modelContext.registerTool({
        name: "get_filter_options",
        description: "Get available filter options for products",
        inputSchema: {
            type: "object",
            properties: {},
        },
        execute: () => {
            showAlert("get_filter_options called");
            return storeManager.getFilterOptions();
        }
    });

    navigator.modelContext.registerTool({
        name: "filter_by_brand",
        description: "Filter products by brand",
        inputSchema: {
            type: "object",
            properties: {
                brand: {
                    type: "string",
                    description: "The brand to filter by"
                }
            },
            required: ["brand"]
        },
        execute: ({ brand }: { brand: string }) => {
            showAlert("filter_by_brand called");
            storeManager.filterByBrand(brand);
            return `Successfully filtered by brand ${brand}`;
        }
    });
    navigator.modelContext.registerTool({
        name: "filter_by_gender",
        description: "Filter products by gender (e.g., MEN, WOMEN, KIDS)",
        inputSchema: {
            type: "object",
            properties: {
                gender: {
                    type: "string",
                    description: "The gender to filter by"
                }
            },
            required: ["gender"]
        },
        execute: ({ gender }: { gender: string }) => {
            showAlert("filter_by_gender called");
            storeManager.filterByGender(gender);
            return `Successfully filtered by gender ${gender}`;
        }
    });

    navigator.modelContext.registerTool({
        name: "filter_by_category",
        description: "Filter products by category",
        inputSchema: {
            type: "object",
            properties: {
                category: {
                    type: "string",
                    description: "The category to filter by"
                }
            },
            required: ["category"]
        },
        execute: ({ category }: { category: string }) => {
            showAlert("filter_by_category called");
            storeManager.filterByCategory(category);
            return `Successfully filtered by category ${category}`;
        }
    });

}




