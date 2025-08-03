
## Supported Authentication Types

- **API Key**: Query parameter or header-based
- **Bearer Token**: Authorization header with Bearer prefix
- **Basic Auth**: Authorization header with Basic prefix

## Error Handling

All API responses follow a consistent format:

```typescript
{
  success: boolean;
  data?: any;           // Present on success
  error?: string;       // Present on failure
  statusCode?: number;  // HTTP status code
}
```

## Troubleshooting

### Common Issues:

1. **Server not starting**: Make sure all dependencies are installed (`npm install`)
2. **API key errors**: Check that your `.env` file has the correct API keys
3. **Path issues**: Update the `cwd` path in the MCP configuration to match your project location
4. **Permission errors**: Ensure the MCP client has permission to execute the commands

### Debug Mode:

To run in debug mode, set the environment variable:
```bash
set DEBUG=mcp-api-server
npm run dev
```

## Contributing

1. Add new endpoint configurations in `src/config/endpoints.ts`
2. Create services for complex API interactions
3. Add corresponding tools for MCP exposure
4. Update documentation and examples

## License

MIT