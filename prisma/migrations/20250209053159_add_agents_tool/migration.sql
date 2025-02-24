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
    "id" BIGSERIAL NOT NULL,
    "agentId" INTEGER NOT NULL,
    "agentToolId" BIGINT NOT NULL,

    CONSTRAINT "AgentToolAgent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentToolAgent_agentId_agentToolId_key" ON "AgentToolAgent"("agentId", "agentToolId");

-- AddForeignKey
ALTER TABLE "AgentToolAgent" ADD CONSTRAINT "AgentToolAgent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentToolAgent" ADD CONSTRAINT "AgentToolAgent_agentToolId_fkey" FOREIGN KEY ("agentToolId") REFERENCES "AgentTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
