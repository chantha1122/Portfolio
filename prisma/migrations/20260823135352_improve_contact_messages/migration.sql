-- CreateIndex
CREATE INDEX "contact_messages_sourceIpHash_createdAt_idx" ON "contact_messages"("sourceIpHash", "createdAt");
