## Svelte MCP Server Usage Guide

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## MDN MCP Server Usage Guide

You can also access the MDN MCP server for comprehensive web development documentation. Here's how to use the available tools effectively:

### 1. get-doc

Retrieves documentation content for specific topics. Accepts single or multiple topics.
When asked about web development topics, ALWAYS use this tool at the start of the chat to find relevant documentation.

### 2. get-compat

Provides compatibility information for web technologies across different browsers.
Use this tool when users ask about browser support for specific web features or technologies.
In my case my baseline for feature support is 90% support across all major browsers, of course if it is baseline widely supported we can just use it without checking compatibility, but if it is a newer feature or has known compatibility issues, we should check it with this tool. also make sure to check whether the feature is a progressive enhancement or a critical feature for the user's project, as this will influence the importance of compatibility information. and you might still be able to use it with a fallback or polyfill if it is not widely supported, but you should inform the user about the compatibility issues and potential solutions.

## Best practices.

- Always start with the list-sections tool for Svelte topics and get-doc for MDN topics to find relevant documentation.
- Analyze the returned documentation sections or topics carefully to understand the use cases and relevance before fetching full documentation.
- Use the svelte-autofixer tool to ensure code quality and adherence to best practices before sharing code snippets with the user.
- Always ask for user confirmation before generating a playground link, and only do so after completing the code to avoid unnecessary links.
- When discussing web features, always check for compatibility issues using the get-compat tool, especially for newer features or those with known issues, and inform the user about potential solutions if compatibility is a concern.
  By following these guidelines, you can effectively utilize the Svelte MCP and MDN MCP servers to provide accurate and helpful information to users while ensuring code quality and compatibility.
