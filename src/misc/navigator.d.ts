interface ModelContext {
    registerTool(tool: {
        name: string;
        description: string;
        inputSchema: any;
        execute: (args: any) => any;
    }): void;
    unregisterTool(name: string)
}

interface Navigator {
    readonly modelContext?: ModelContext;
}
