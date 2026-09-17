export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: LogLevel = 'info';
  private isStdioMode: boolean = false;

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLevel && envLevel in LEVEL_PRIORITY) {
      this.level = envLevel;
    }
  }

  public setStdioMode(enabled: boolean): void {
    this.isStdioMode = enabled;
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [facebook-marketplace-mcp]:`;
    const formattedArgs = args.length > 0 ? ' ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ') : '';
    return `${prefix} ${message}${formattedArgs}`;
  }

  public debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      const formatted = this.formatMessage('debug', message, ...args);
      // In stdio mode, EVERYTHING goes to stderr to keep stdout clean for JSON-RPC
      process.stderr.write(formatted + '\n');
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      const formatted = this.formatMessage('info', message, ...args);
      if (this.isStdioMode) {
        process.stderr.write(formatted + '\n');
      } else {
        console.log(formatted);
      }
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      const formatted = this.formatMessage('warn', message, ...args);
      process.stderr.write(formatted + '\n');
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      const formatted = this.formatMessage('error', message, ...args);
      process.stderr.write(formatted + '\n');
    }
  }
}

export const logger = new Logger();
