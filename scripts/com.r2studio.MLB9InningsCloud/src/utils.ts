export function executeCommands(...commands: string[]): string[] {
  const results: string[] = [];
  for (const command of commands) {
    const res = execute(command);
    if (endsWith(res, 'exit status 1')) {
      console.log(`[Error]: ${command} :\n ${res}\n`);
    } else {
      console.log(`[Ok]: ${command} :\n ${res}\n`);
    }
    results.push(res);
  }
  return results;
}

export function endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
