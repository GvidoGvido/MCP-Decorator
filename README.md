# MCP Decorator

> **Supercharge Model Context Protocol (MCP) servers with zero-trust security shields, AST distillation, domain context enrichment, and autonomous multi-agent reasoning with Gemini 3.7 Flash.**

Official Repository: [https://github.com/GvidoGvido/MCP-Decorator](https://github.com/GvidoGvido/MCP-Decorator)

---

## ⚡ The Problem with Raw MCP

Standard Model Context Protocol (MCP) servers stream raw tool outputs directly into Large Language Models. In real-world enterprise environments, this introduces critical friction points:

1. **Massive Token Waste & Latency**: Raw JSON, giant Git diffs, verbose database catalogs, and lockfiles consume up to 80% redundant tokens.
2. **Security & PII Leaks**: Unsanitized tool stdouts can expose live database credentials, GitHub personal access tokens, session cookies, and user PII to the prompt stream.
3. **No Domain Awareness**: Raw tools emit isolated rows without semantic schema links, relational entity graphs, or blast radius awareness.
4. **High Round-Trip Latency**: Complex workflows require multiple sequential roundtrips between client, server, and model.

---

## 🛡️ The MCP Decorator Solution

**MCP Decorator** operates as an intelligent, transparent interception proxy layer situated between your MCP client (Claude Desktop, Cursor, Custom Agent) and underlying MCP servers.

```
[ MCP Client / Agent ]
         │
         ▼
┌────────────────────────────────────────────────────────┐
│               MCP DECORATOR PROXY                      │
│                                                        │
│  1. Zero-Trust Sentinel (PII & Secret Redactor)        │
│  2. AST & Token Distiller (60-80% Compression)        │
│  3. Relational Domain Enricher (Topology & Risk)       │
│  4. Active Safety Gate & Rollback Sandbox              │
│  5. Sub-2ms Semantic Cache (0 Tokens)                  │
│  6. Multi-Agent Swarm (Gemini 3.7 Flash Consensus)     │
└────────────────────────────────────────────────────────┘
         │
         ▼
[ Raw MCP Server (Git, Postgres, GitHub, Slack, etc.) ]
```

---

## ✨ Core Decorators & Features

### 1. 🛡️ Zero-Trust Security & PII Redactor
- Intercepts raw stdout from database and API servers.
- Sanitizes GitHub Personal Access Tokens, JWTs, Stripe keys, and user emails.
- Enforces strict read-only execution perimeters.

### 2. ⚡ AST & Token Distiller
- Strips whitespace, null boilerplate, redundant JSON keys, and package lockfile noise.
- Compresses code diffs into high-density AST semantic patches.
- Yields **60%–80% token savings** per tool call.

### 3. 🧠 Pre-Flight Relational Context Enricher
- Attaches schema foreign-key mappings, active index suggestions, and repo topology.
- Injects pre-calculated blast radius metrics so the model reasons with complete context.

### 4. 🔀 Composite Super-Tools (1-Shot Multi-Tool Ingestion)
- Combines multi-step diagnostic tools (e.g., `git.get_diff` + `github.pr_comments` + `sec.ast_scan`) into a single virtual tool response, eliminating LLM roundtrips.

### 5. 🛑 Active Safety Gates & Rollback Dry-Run Sandbox
- Catches destructive commands (`DROP TABLE`, `DELETE CASCADE`, `rm -rf`).
- Runs queries inside a simulated transaction sandbox, estimating row impact before user confirmation.

### 6. ⚡ Sub-2ms Semantic Cache
- High-performance deterministic L2 vector key-value cache.
- Replays unchanging schema and metadata queries in `<2ms` at **0 token cost**.

### 7. 🤖 Visual Multi-Agent Swarm (Powered by Gemini 3.7 Flash)
- Visual topology mesh featuring 5 specialized interceptor agents:
  - **Zero-Trust Sentinel**: Perimeter inspection & credential masking
  - **AST Distiller**: Semantic payload compression
  - **Domain Specialist**: Blast radius & relational context linking
  - **Ecosystem Scout**: Cross-references global MCP registry
  - **Verification Critic**: Protocol conformity & SHA256 cryptographic attestation
- **Lead Reasoner Consensus**: Powered by `gemini-3.7-flash`, synthesizing formatted, zero-hallucination insights.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/GvidoGvido/MCP-Decorator.git
cd MCP-Decorator
npm install
```

### 2. Configure Environment

Create a `.env` file or export your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Client Integrations

### Claude Desktop Configuration

Add the decorator proxy to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "postgres-decorated": {
      "command": "npx",
      "args": ["-y", "@mcp-decorator/proxy", "--source", "postgres", "--enable-steroids"],
      "env": {
        "MCP_DECORATOR_MODE": "strict-zero-trust",
        "MCP_AST_DISTILLER": "enabled",
        "MCP_DOMAIN_ENRICHER": "enabled"
      }
    }
  }
}
```

### Cursor IDE Configuration

Add to your `.cursor/mcp.json`:

```json
{
  "mcp.servers": {
    "git-decorated": {
      "type": "stdio",
      "command": "node",
      "args": ["./mcp-decorator-proxy.js"],
      "options": {
        "cwd": "${workspaceFolder}"
      }
    }
  }
}
```

---

## 🛠️ TypeScript Proxy API

```typescript
import { McpDecoratorProxy } from "@mcp-decorator/core";

const proxy = new McpDecoratorProxy({
  source: "postgres",
  decorators: ["zero-trust-shield", "ast-distiller", "domain-enricher"],
  model: "gemini-3.7-flash",
});

proxy.on("intercept", (event) => {
  console.log(`[MCP Decorator] Intercepted ${event.toolName} - Tokens Saved: ${event.tokensSaved}`);
});

await proxy.listen({ port: 3000 });
```

---

## 📄 License

MIT License. Designed with craftsmanship for the Model Context Protocol ecosystem.

GitHub: [https://github.com/GvidoGvido/MCP-Decorator](https://github.com/GvidoGvido/MCP-Decorator)
