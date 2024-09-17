const styleContent = `
textarea {
  position: fixed; /* Fix the position to the top */
  top: 0;
  left: 0;
  width: 100%; /* Take up the full width */
  height: 200px; /* Adjust height as needed */
  z-index: 9999; /* Ensure it stays on top */
  background-color: rgba(0, 0, 0, 0); /* Semi-transparent background */
  color: #00ff00; /* Text color for debug output */
  font-family: monospace;
  padding: 10px;
  border: none; /* Remove border */
  overflow-y: auto; /* Enable scrolling if needed */
  pointer-events: none;
  resize: none; /* Disable resizing */
}
`;
const styleElement = document.createElement("style");
styleElement.textContent = styleContent;
document.head.appendChild(styleElement);

const textarea = document.createElement("textarea");
textarea.readOnly = true;
document.body.appendChild(textarea);

export function logDebug(...messages: unknown[]): void {
  textarea.value += [...messages].map((o) => (typeof o === "object" ? JSON.stringify(o, null, 2) : o)).join(" ") + "\n";
  textarea.scrollTop = textarea.scrollHeight;
}
