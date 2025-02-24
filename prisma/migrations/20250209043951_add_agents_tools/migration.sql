-- CreateTable
CREATE TABLE "_AgentToAgentTools" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_AgentToAgentTools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AgentToAgentTools_B_index" ON "_AgentToAgentTools"("B");

-- AddForeignKey
ALTER TABLE "_AgentToAgentTools" ADD CONSTRAINT "_AgentToAgentTools_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToAgentTools" ADD CONSTRAINT "_AgentToAgentTools_B_fkey" FOREIGN KEY ("B") REFERENCES "AgentTool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
