-- AlterTable
ALTER TABLE "contact_messages" ADD COLUMN     "repliedAt" TIMESTAMP(3),
ADD COLUMN     "replyMessage" TEXT,
ADD COLUMN     "sourceIpHash" TEXT;
