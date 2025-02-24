/*
  Warnings:

  - You are about to drop the `AgentsToAgentTools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentsToAgentTools" DROP CONSTRAINT "AgentsToAgentTools_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentsToAgentTools" DROP CONSTRAINT "AgentsToAgentTools_agentToolId_fkey";

-- DropTable
DROP TABLE "AgentsToAgentTools";

-- CreateTable
CREATE TABLE "AgentsAgentTools" (
    "id" BIGSERIAL NOT NULL,
    "agentId" INTEGER NOT NULL,
    "agentToolId" BIGINT NOT NULL,

    CONSTRAINT "AgentsAgentTools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentsAgentTools_agentId_agentToolId_key" ON "AgentsAgentTools"("agentId", "agentToolId");

-- AddForeignKey
ALTER TABLE "AgentsAgentTools" ADD CONSTRAINT "AgentsAgentTools_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentsAgentTools" ADD CONSTRAINT "AgentsAgentTools_agentToolId_fkey" FOREIGN KEY ("agentToolId") REFERENCES "AgentTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
