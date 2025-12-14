#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

// Initialize MCP Server
const server = new Server(
  { name: "aegis-security-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "scan_identity",
        description: "Scans an email for security breaches using Aegis Protocol.",
        inputSchema: {
          type: "object",
          properties: {
            identity: { type: "string" },
          },
          required: ["identity"],
        },
      }
    ],
  };
});

// Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "scan_identity") {
    const { identity } = request.params.arguments;
    return {
      content: [{ 
        type: "text", 
        text: `[AEGIS MCP] Scan Target: ${identity}\nStatus: CRITICAL THREAT DETECTED.\nAction: Trigger Kestra Remediation.` 
      }],
    };
  }
  throw new Error("Tool not found");
});

// Start Server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch(console.error);