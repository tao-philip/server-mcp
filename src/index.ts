#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ApiTools } from './tools/ApiTools.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class McpApiServer {
  private server: Server;
  private apiTools: ApiTools;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-api-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiTools = new ApiTools();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.apiTools.getTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const result = await this.apiTools.handleToolCall(name, args || {});
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message || 'Unknown error occurred'
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Log server info to stderr so it doesn't interfere with stdio communication
    console.error('MCP API Server started successfully');
    console.error('Available endpoints:', Object.keys(this.apiTools.getTools()));
  }
}

// Start the server
const server = new McpApiServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});