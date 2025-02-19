import { z } from "zod";

const SourceMapEntrySchema = z.object({
    loc: z.object({
        file: z.string(),
        line: z.number(),
        col: z.number(),
    }),
    start: z.number(),
    end: z.number(),
});

export const SourceMapSchema = z.object({
    locations: z.array(SourceMapEntrySchema),
    correspondence: z.record(z.number()),
});

type SourceMap = z.infer<typeof SourceMapSchema>;

type SourceMapEntry = z.infer<typeof SourceMapEntrySchema>;

const shiftLines = (
    entry: SourceMapEntry,
    distance: number,
): SourceMapEntry => {
    return {
        ...entry,
        start: entry.start + distance,
        end: entry.end + distance,
    };
};

export class Mapper {
    #relativeMappings: Map<string, SourceMapEntry[]> = new Map();
    #absoluteMapping: SourceMapEntry[] = [];

    resolveRelativePosition(name: string, position: number) {
        const mapping = this.#relativeMappings.get(name);
        if (mapping) {
            this.#absoluteMapping.push(
                ...mapping.map((entry) => shiftLines(entry, position)),
            );
        }
    }

    addEntry(name: string, location: SourceMapEntry) {
        if (!this.#relativeMappings.has(name)) {
            this.#relativeMappings.set(name, []);
        }
        this.#relativeMappings.get(name)!.push(location);
    }

    getAbsoluteMapping() {
        return [...this.#absoluteMapping].sort((a, b) => {
            const fileA = a.loc.file;
            const fileB = b.loc.file;
            if (fileA < fileB) return -1;
            if (fileA > fileB) return 1;

            if (a.loc.line !== b.loc.line) {
                return a.loc.line - b.loc.line;
            }

            return a.loc.col - b.loc.col;
        });
    }

    formSourceMap(): SourceMap {
        const sortedEntries = this.getAbsoluteMapping();
        const record: Record<string, number> = {};
        sortedEntries.forEach((entry, index) => {
            for (let i = entry.start; i <= entry.end; i++) {
                record[i] = index;
            }
        });
        return {
            locations: sortedEntries,
            correspondence: record,
        };
    }
}
