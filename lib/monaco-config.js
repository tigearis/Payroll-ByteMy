/**
 * Monaco Editor configuration
 * This file configures Monaco Editor to work with Content Security Policy
 */

// Define Monaco Editor CDN paths
export const MONACO_EDITOR_CDN_BASE =
  "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";
export const MONACO_EDITOR_LOADER = `${MONACO_EDITOR_CDN_BASE}/vs/loader.js`;

// Monaco Editor configuration options
export const monacoEditorOptions = {
  theme: "vs-dark",
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  readOnly: false,
};

// Monaco Editor loader configuration
export function configureMonacoLoader() {
  // This function is called before Monaco is loaded
  if (typeof window !== "undefined") {
    window.MonacoEnvironment = {
      getWorkerUrl: function (_, label) {
        if (label === "json") {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: '${MONACO_EDITOR_CDN_BASE}'
            };
            importScripts('${MONACO_EDITOR_CDN_BASE}/vs/language/json/json.worker.js');
          `)}`;
        }
        if (label === "typescript" || label === "javascript") {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: '${MONACO_EDITOR_CDN_BASE}'
            };
            importScripts('${MONACO_EDITOR_CDN_BASE}/vs/language/typescript/ts.worker.js');
          `)}`;
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: '${MONACO_EDITOR_CDN_BASE}'
            };
            importScripts('${MONACO_EDITOR_CDN_BASE}/vs/language/html/html.worker.js');
          `)}`;
        }
        if (label === "css" || label === "scss" || label === "less") {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: '${MONACO_EDITOR_CDN_BASE}'
            };
            importScripts('${MONACO_EDITOR_CDN_BASE}/vs/language/css/css.worker.js');
          `)}`;
        }
        if (label === "graphql") {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: '${MONACO_EDITOR_CDN_BASE}'
            };
            importScripts('${MONACO_EDITOR_CDN_BASE}/vs/basic-languages/graphql/graphql.js');
          `)}`;
        }
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = {
            baseUrl: '${MONACO_EDITOR_CDN_BASE}'
          };
          importScripts('${MONACO_EDITOR_CDN_BASE}/vs/editor/editor.worker.js');
        `)}`;
      },
    };
  }
}

// Initialize Monaco configuration
if (typeof window !== "undefined") {
  configureMonacoLoader();
}
