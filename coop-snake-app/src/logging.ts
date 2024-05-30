export type PerfTimer = {
    end: () => void;
};

export function perfStart(label: string): PerfTimer {
    console.log(`start perf: ${label}`);
    const t0 = performance.now();

    return {
        end: () => {
            const elapsed = performance.now() - t0;
            console.log(
                `end perf: ${label} | elapsed: ${elapsed.toFixed(4)}ms`,
            );
        },
    };
}

export type BatchLog = {
    add: (msg: string) => void;
    flush: () => void;
};

export function batch(max: number, level: "info" | "warn" | "error"): BatchLog {
    const batches: string[] = [];
    const add = (msg: string) => {
        if (batches.length >= max) {
            return;
        }

        batches.push(msg);
        if (batches.length >= max) {
            batchLog(batches, level);
        }
    };

    const flush = () => {
        batchLog(batches, level);
    };

    return { add, flush };
}

function batchLog(msgs: string[], level: "info" | "warn" | "error") {
    while (msgs.length > 0) {
        const msg = msgs.shift();
        console[level](msg);
    }
}
