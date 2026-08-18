import CommentsManager from "@/components/dashboard/CommentsManager";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CommentsPage({ params }: Props) {
  const { locale } = await params;
  const safeLocale: "en" | "km" = locale === "km" ? "km" : "en";

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      activity: {
        select: {
          id: true,
          titleEn: true,
          titleKm: true,
          type: true,
        },
      },
    },
  });

  return (
    <CommentsManager
      locale={safeLocale}
      comments={comments.map((comment) => ({
        id: comment.id,
        name: comment.name,
        email: comment.email,
        message: comment.message,
        isApproved: comment.isApproved,
        createdAt: comment.createdAt.toISOString(),
        activity: comment.activity,
      }))}
    />
  );
}
