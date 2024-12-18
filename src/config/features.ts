import { CompilerContext, createContextStore } from "../context";

const featureStore = createContextStore<boolean | null | string>();

export function enabledInline(ctx: CompilerContext) {
    return featureEnabled(ctx, "inline");
}

export function enabledDebug(ctx: CompilerContext) {
    return featureEnabled(ctx, "debug");
}

export function enabledExternals(ctx: CompilerContext) {
    return featureEnabled(ctx, "external");
}

export function enabledIpfsAbiGetter(ctx: CompilerContext) {
    return featureEnabled(ctx, "ipfsAbiGetter");
}

export function enabledInterfacesGetter(ctx: CompilerContext) {
    return featureEnabled(ctx, "interfacesGetter");
}

function featureEnabled(ctx: CompilerContext, key: string) {
    return featureStore.get(ctx, key) === true;
}

export function featureEnable(ctx: CompilerContext, key: string) {
    return featureStore.set(ctx, key, true);
}
