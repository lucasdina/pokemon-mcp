import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const MIN_POKEMON_ID = 1;
const MAX_POKEMON_ID = 1028;
const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon/";

/**
 * Generate a random Pokemon ID between min and max (inclusive)
 */
function generateRandomPokemonId(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fetch Pokemon data from the PokeAPI
 */
async function fetchPokemonData(pokemonId) {
    const url = `${POKE_API_URL}${pokemonId}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch Pokemon data: ${error.message}`);
    }
}

async function main() {
    // Create the MCP server with metadata
    const server = new McpServer({
        name: "pokemon-mcp-server",
        version: "1.0.0"
    });

    // Register the tool for fetching random Pokemon data
    server.tool(
        "get_random_pokemon",
        "Fetches a random Pokemon from the PokeAPI. The Pokemon ID is randomly generated between 1 and 1028.",
        {
            forceId: z.number()
                .int()
                .min(MIN_POKEMON_ID)
                .max(MAX_POKEMON_ID)
                .optional()
                .describe("Optional Pokemon ID to fetch. If not provided, a random one will be generated.")
        },
        async ({ forceId }) => {
            let pokemonId = forceId;
            
            // Generate random ID if none provided
            if (pokemonId === undefined) {
                pokemonId = generateRandomPokemonId(MIN_POKEMON_ID, MAX_POKEMON_ID);
                console.log(`Generated random Pokemon ID: ${pokemonId}`);
            } else {
                console.log(`Using specified Pokemon ID: ${pokemonId}`);
            }

            try {
                const pokemonData = await fetchPokemonData(pokemonId);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(pokemonData, null, 2)
                        }
                    ],
                    structuredContent: pokemonData
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error fetching Pokemon data: ${error.message}`
                        }
                    ],
                    isError: true
                };
            }
        }
    );

    // Create the transport and connect to STDIO
    const transport = new StdioServerTransport();
    
    console.error("Pokemon MCP Server started. Waiting for requests on STDIO...");
    
    await server.connect(transport);
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
