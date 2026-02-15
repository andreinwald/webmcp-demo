import { useEffect } from "react";


type Props = {
    name: string;
    description: string;
    inputSchema: any;
    execute: (args?: any) => any;
}

export function useRegisterMCP(
    props: Props
) {

    useEffect(() => {
        if (!navigator.modelContext) {
            return;
        }
        navigator.modelContext.registerTool(props);

        return () => {
            if (!navigator.modelContext) {
                return;
            }
            navigator.modelContext.unregisterTool(props.name);
        };
    }, []);
}