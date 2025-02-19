import { CompilerContext } from "../context/context";
import { createABI } from "../generator/createABI";
import { writeProgram } from "../generator/writeProgram";

export async function compile(
    ctx: CompilerContext,
    name: string,
    basename: string,
) {
    const abi = createABI(ctx, name);
    const output = await writeProgram(ctx, abi, basename);
    const cOutput = {
        entrypoint: output.entrypoint,
        files: output.files,
        abi: output.abi,
    };
    const locations = output.locations;
    return { output: cOutput, ctx, locations };
}
