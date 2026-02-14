interface ModelContext {
    registerTool(tool: {
        name: string;
        description: string;
        inputSchema: object;
        execute: (args: any) => any;
    }): void;
}

interface Navigator {
    readonly modelContext?: ModelContext;
}
