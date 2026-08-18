"use server";

import { compare, hash } from "bcryptjs";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(128),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export type ChangePasswordState = {
  success: boolean;
  message: string | null;
  fieldErrors?: Record<string, string[]>;
};

export const initialChangePasswordState: ChangePasswordState = {
  success: false,
  message: null,
};

export async function changePasswordAction(
  _previousState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    return {
      success: false,
      message: "unauthorized",
    };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    const flattened = parsed.error.flatten();

    Object.entries(flattened.fieldErrors).forEach(([key, value]) => {
      if (value) fieldErrors[key] = value;
    });

    return {
      success: false,
      message: "validation_error",
      fieldErrors,
    };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    return {
      success: false,
      message: "user_not_found",
    };
  }

  const matches = await compare(parsed.data.currentPassword, user.passwordHash);

  if (!matches) {
    return {
      success: false,
      message: "wrong_current_password",
      fieldErrors: {
        currentPassword: ["Current password is incorrect"],
      },
    };
  }

  try {
    const passwordHash = await hash(parsed.data.newPassword, 12);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return {
      success: true,
      message: "password_changed",
    };
  } catch (error) {
    console.error("Change password error:", error);

    return {
      success: false,
      message: "change_failed",
    };
  }
}
