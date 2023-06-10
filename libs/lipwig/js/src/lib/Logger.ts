enum LogLevel {
    OFF,
    FATAL,
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE,
    ALL,
}

export class Logger {
    static level: LogLevel = LogLevel.ALL;

    static log(...args: unknown[]) {
        if (Logger.level < LogLevel.INFO) {
            return;
        }
        console.log('[Lipwig]', ...args);
    }

    static info(...args: unknown[]) {
        if (Logger.level < LogLevel.INFO) {
            return;
        }
        console.info('[Lipwig]', ...args);
    }

    static warn(...args: unknown[]) {
        if (Logger.level < LogLevel.WARN) {
            return;
        }
        console.warn('[Lipwig]', ...args);
    }

    static error(...args: unknown[]) {
        if (Logger.level < LogLevel.ERROR) {
            return;
        }
        console.error('[Lipwig]', ...args);
    }

    static debug(...args: unknown[]) {
        if (Logger.level < LogLevel.DEBUG) {
            return;
        }
        console.debug('[Lipwig]', ...args);
    }

    static trace(...args: unknown[]) {
        if (Logger.level < LogLevel.TRACE) {
            return;
        }
        console.trace('[Lipwig]', ...args);
    }
}
