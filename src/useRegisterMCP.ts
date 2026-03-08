import { useEffect } from "react";
import { z } from 'zod';


type RegisterMCPProps<Input extends Record<string, unknown> = Record<string, never>> = {
    name: string;
    description: string;
    paramsSchema?: z.ZodType<Input>;
    execute: (args: Input) => any;
};

export function registerMCP<Input extends Record<string, unknown> = Record<string, never>>(
    props: RegisterMCPProps<Input>
) {
    if (!navigator.modelContext) return;
    const inputSchema = props.paramsSchema ? props.paramsSchema.toJSONSchema() : undefined;
    navigator.modelContext.registerTool({
        name: props.name,
        description: props.description,
        inputSchema,
        execute: (args: any) => {
            if (props.paramsSchema) {
                const parsed = props.paramsSchema.safeParse(args);
                if (!parsed.success) {
                    throw new Error(`Invalid arguments for tool ${props.name}: ${parsed.error.message}`);
                }
                return props.execute(parsed.data);
            }
            return props.execute(args);
        },
    });
}

export function useRegisterMCP<Input extends Record<string, unknown> = Record<string, never>>(
    props: RegisterMCPProps<Input>
) {
    useEffect(() => {
        registerMCP(props);
        return () => {
            if (!navigator.modelContext) return;
            navigator.modelContext.unregisterTool(props.name);
        };
    }, []);
}