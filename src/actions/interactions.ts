"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const commentSchema = z.object({
  activityId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2).max(100),
  email: z
    .union([z.literal(""), z.string().trim().email()])
    .optional()
    .transform((value) => value || null),
  message: z.string().trim().min(2).max(1500),
});

export type InteractionResult = {
  success: boolean;
  message: string;
};

export type ToggleLikeResult = InteractionResult & {
  liked: boolean;
  count: number;
};

export async function addPublicCommentAction(
  activityId: number,
  formData: FormData,
): Promise<InteractionResult> {
  const parsed = commentSchema.safeParse({
    activityId,
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your name and comment.",
    };
  }

  const activity = await prisma.activity.findFirst({
    where: {
      id: parsed.data.activityId,
      published: true,
    },
    select: { id: true },
  });

  if (!activity) {
    return {
      success: false,
      message: "This portfolio item is not available.",
    };
  }

  try {
    await prisma.comment.create({
      data: {
        activityId: parsed.data.activityId,
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        isApproved: false,
      },
    });

    revalidatePath("/en/dashboard/comments");
    revalidatePath("/km/dashboard/comments");

    return {
      success: true,
      message: "Comment submitted and waiting for approval.",
    };
  } catch (error) {
    console.error("Public comment error:", error);

    return {
      success: false,
      message: "Unable to submit comment.",
    };
  }
}

export async function togglePublicLikeAction(
  activityId: number,
  visitorKey: string,
): Promise<ToggleLikeResult> {
  const cleanKey = visitorKey.trim().slice(0, 180);

  if (!Number.isInteger(activityId) || activityId <= 0 || cleanKey.length < 8) {
    return {
      success: false,
      message: "Unable to update like.",
      liked: false,
      count: 0,
    };
  }

  const activity = await prisma.activity.findFirst({
    where: { id: activityId, published: true },
    select: { id: true },
  });

  if (!activity) {
    return {
      success: false,
      message: "Portfolio item not found.",
      liked: false,
      count: 0,
    };
  }

  try {
    const existing = await prisma.like.findUnique({
      where: {
        activityId_visitorKey: {
          activityId,
          visitorKey: cleanKey,
        },
      },
      select: { id: true },
    });

    let liked = false;

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.like.create({
        data: {
          activityId,
          visitorKey: cleanKey,
        },
      });
      liked = true;
    }

    const count = await prisma.like.count({
      where: { activityId },
    });

    return {
      success: true,
      message: liked ? "Liked" : "Like removed",
      liked,
      count,
    };
  } catch (error) {
    console.error("Public like error:", error);

    const count = await prisma.like.count({
      where: { activityId },
    }).catch(() => 0);

    return {
      success: false,
      message: "Unable to update like.",
      liked: false,
      count,
    };
  }
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user);
}

export async function setCommentApprovalAction(
  id: number,
  isApproved: boolean,
): Promise<InteractionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await prisma.comment.update({
      where: { id },
      data: { isApproved },
    });

    revalidatePath("/en/dashboard/comments");
    revalidatePath("/km/dashboard/comments");
    revalidatePath("/en");
    revalidatePath("/km");

    return {
      success: true,
      message: isApproved ? "Comment approved." : "Comment hidden.",
    };
  } catch (error) {
    console.error("Comment approval error:", error);

    return {
      success: false,
      message: "Unable to update comment.",
    };
  }
}

export async function deleteCommentAction(id: number): Promise<InteractionResult> {
  if (!(await requireAdmin())) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await prisma.comment.delete({
      where: { id },
    });

    revalidatePath("/en/dashboard/comments");
    revalidatePath("/km/dashboard/comments");
    revalidatePath("/en");
    revalidatePath("/km");

    return {
      success: true,
      message: "Comment deleted.",
    };
  } catch (error) {
    console.error("Comment delete error:", error);

    return {
      success: false,
      message: "Unable to delete comment.",
    };
  }
}

export async function getPublicLikeStateAction(
  activityId: number,
  visitorKey: string,
): Promise<{ liked: boolean; count: number }> {
  const cleanKey = visitorKey.trim().slice(0, 180);

  if (!Number.isInteger(activityId) || activityId <= 0 || cleanKey.length < 8) {
    return { liked: false, count: 0 };
  }

  const [existing, count] = await Promise.all([
    prisma.like.findUnique({
      where: {
        activityId_visitorKey: {
          activityId,
          visitorKey: cleanKey,
        },
      },
      select: { id: true },
    }),
    prisma.like.count({
      where: { activityId },
    }),
  ]);

  return {
    liked: Boolean(existing),
    count,
  };
}
