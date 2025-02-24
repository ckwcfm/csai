-- DropForeignKey
ALTER TABLE "AgentsAgentTools" DROP CONSTRAINT "AgentsAgentTools_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentsAgentTools" DROP CONSTRAINT "AgentsAgentTools_agentToolId_fkey";

-- AddForeignKey
ALTER TABLE "AgentsAgentTools" ADD CONSTRAINT "AgentsAgentTools_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentsAgentTools" ADD CONSTRAINT "AgentsAgentTools_agentToolId_fkey" FOREIGN KEY ("agentToolId") REFERENCES "AgentTool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
