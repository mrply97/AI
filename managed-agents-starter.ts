/**
 * Anthropic Managed Agents Starter
 *
 * Pattern: create Agent once → reference by ID in every Session → stream events.
 * Store the agent ID somewhere persistent (env var, DB) so you only call
 * agents.create() once per logical "assistant configuration".
 *
 * Docs: https://docs.anthropic.com/en/docs/managed-agents
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from environment

async function createAgent() {
  const agent = await client.beta.agents.create({
    name: "healthledger-assistant",
    model: "claude-opus-4-8",
    instructions:
      "You are a helpful AI assistant for HealthLedger. Help users manage their health records, analyze data, and answer health-related questions.",
  });

  console.log("Agent created:", agent.id);
  console.log("Store this ID — reuse it for every session:");
  console.log(`AGENT_ID=${agent.id}`);
  return agent;
}

async function runSession(agentId: string, userMessage: string) {
  // Create a new session for this run
  const session = await client.beta.sessions.create({
    agent_id: agentId,
  });

  console.log(`\nSession ${session.id} started`);
  console.log(`User: ${userMessage}\n`);

  // Stream the response events
  const stream = client.beta.sessions.events.stream(session.id, {
    input: [{ role: "user", content: userMessage }],
  });

  process.stdout.write("Assistant: ");
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
    }
  }
  console.log("\n");

  return session;
}

async function main() {
  // Step 1: Create the agent (run once, then reuse the ID)
  // In production: load from env, e.g. process.env.AGENT_ID
  const agentId = process.env.AGENT_ID;

  if (!agentId) {
    console.log("No AGENT_ID set — creating a new agent...");
    const agent = await createAgent();
    console.log(`\nRe-run with: AGENT_ID=${agent.id} npx ts-node managed-agents-starter.ts`);
    return;
  }

  // Step 2: Run a session against the existing agent
  await runSession(agentId, "Hello! What can you help me with today?");
}

main().catch(console.error);
