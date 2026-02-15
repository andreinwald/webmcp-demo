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