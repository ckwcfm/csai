/*
  Warnings:

  - You are about to drop the `_AgentToAgentTools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AgentToAgentTools" DROP CONSTRAINT "_AgentToAgentTools_A_fkey";

-- DropForeignKey
ALTER TABLE "_AgentToAgentTools" DROP CONSTRAINT "_AgentToAgentTools_B_fkey";

-- DropTable
DROP TABLE "_AgentToAgentTools";

-- CreateTable
CREATE TABLE "AgentToolAgent" (
    "agent_tool_id" BIGINT NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "AgentToolAgent_pkey" PRIMARY KEY ("agent_tool_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentToolAgent_agent_tool_id_key" ON "AgentToolAgent"("agent_tool_id");

-- AddForeignKey
ALTER TABLE "AgentToolAgent" ADD CONSTRAINT "AgentToolAgent_agent_tool_id_fkey" FOREIGN KEY ("agent_tool_id") REFERENCES "AgentTool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentToolAgent" ADD CONSTRAINT "AgentToolAgent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
