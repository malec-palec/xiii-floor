export function logDebug(...messages: unknown[]): void {
  l.value += [...messages].map((o) => (typeof o === "object" ? JSON.stringify(o, null, 2) : o)).join(" ") + "\n";
  l.scrollTop = l.scrollHeight;
}
