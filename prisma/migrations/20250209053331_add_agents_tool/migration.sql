/*
  Warnings:

  - You are about to drop the `AgentToolAgent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentToolAgent" DROP CONSTRAINT "AgentToolAgent_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentToolAgent" DROP CONSTRAINT "AgentToolAgent_agentToolId_fkey";

-- DropTable
DROP TABLE "AgentToolAgent";

-- CreateTable
CREATE TABLE "AgentsToAgentTools" (
    "id" BIGSERIAL NOT NULL,
    "agentId" INTEGER NOT NULL,
    "agentToolId" BIGINT NOT NULL,

    CONSTRAINT "AgentsToAgentTools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentsToAgentTools_agentId_agentToolId_key" ON "AgentsToAgentTools"("agentId", "agentToolId");

-- AddForeignKey
ALTER TABLE "AgentsToAgentTools" ADD CONSTRAINT "AgentsToAgentTools_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentsToAgentTools" ADD CONSTRAINT "AgentsToAgentTools_agentToolId_fkey" FOREIGN KEY ("agentToolId") REFERENCES "AgentTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
