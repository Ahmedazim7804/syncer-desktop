class Logger {
  private static levels = ['trace', 'debug', 'info', 'warn', 'error'] as const;
  private currentLevelIndex = 0;

  setLevel(level: typeof Logger.levels[number]) {
    const idx = Logger.levels.indexOf(level);
    if (idx !== -1) {
      this.currentLevelIndex = idx;
    }
  }

  private shouldLog(level: string) {
    const idx = Logger.levels.indexOf(level as any);
    return idx >= this.currentLevelIndex;
  }

  private format(header: string, message: string) {
    return [`%c${header}:%c ${message}`, 'font-weight:bold', 'font-weight:normal'];
  }

  trace(header: string, message: string, ...optionalParams: any[]) {
    if (!this.shouldLog('trace')) return;
    const [fmt, ...styles] = this.format(header, message);
    console.trace(fmt, ...styles, ...optionalParams);
  }

  debug(header: string, message: string, ...optionalParams: any[]) {
    if (!this.shouldLog('debug')) return;
    const [fmt, ...styles] = this.format(header, message);
    console.debug(fmt, ...styles, ...optionalParams);
  }

  info(header: string, message: string, ...optionalParams: any[]) {
    if (!this.shouldLog('info')) return;
    const [fmt, ...styles] = this.format(header, message);
    console.info(fmt, ...styles, ...optionalParams);
  }

  warn(header: string, message: string, ...optionalParams: any[]) {
    if (!this.shouldLog('warn')) return;
    const [fmt, ...styles] = this.format(header, message);
    console.warn(fmt, ...styles, ...optionalParams);
  }

  error(header: string, message: string, ...optionalParams: any[]) {
    if (!this.shouldLog('error')) return;
    const [fmt, ...styles] = this.format(header, message);
    console.error(fmt, ...styles, ...optionalParams);
  }
}

const logger = new Logger();
export default logger;
