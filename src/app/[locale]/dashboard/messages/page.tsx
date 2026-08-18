import MessagesManager from "@/components/dashboard/MessagesManager";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <MessagesManager
      locale={safeLocale}
      messages={messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      }))}
    />
  );
}
