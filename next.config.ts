import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stops `next dev` from recreating AGENTS.md and CLAUDE.md.
  agentRules: false,
};

export default nextConfig;
