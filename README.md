# Pokemon MCP Server

An [MCP](https://modelcontextprotocol.io/) (Model Context Protocol) server that fetches random Pokémon data from the [PokeAPI](https://pokeapi.co/).

## Prerequisites

- **Node.js 22** — this is required to run the server.
- Run `npm install` before first use to install dependencies (`@modelcontextprotocol/sdk`, `zod`).

```bash
npm install
```

## Usage

Start the server:

```bash
node server.js
```

The server communicates over STDIO using the MCP protocol, so it's designed to be used as an MCP tool within an AI assistant CLI.

## Adding to Claude Code

To give [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) access to this server, add it to your `CLAUDE.md` or configure it via the MCP settings:

1. Create a `claude_desktop_config.json` (or equivalent MCP config file for your CLI):

```json
{
  "mcpServers": {
    "pokemon": {
      "command": "node",
      "args": ["/absolute/path/to/server.js"]
    }
  }
}
```

Replace `/absolute/path/to/server.js` with the actual absolute path to this project's `server.js`.

2. Restart Claude Code — it will detect and connect to the Pokémon MCP server.

Once connected, you can ask Claude Code things like:

- *"Show me a random Pokémon"*
- *"Tell me about Charizard (ID 6)"*
- *"Fetch Pokémon with ID 25"*

## Available Tool

| Tool | Description |
|---|---|
| `get_random_pokemon` | Fetches a random Pokémon from the PokeAPI. Optionally accepts a specific Pokémon ID (1–1028). |
