import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

export const inngest = new Inngest({ id: "nexus" });

// Helper: Map Clerk roles to Prisma roles
const getRole = (clerkRole) => {
  return clerkRole === "org:admin" ? "ADMIN" : "MEMBER";
};

// 1. Sync User (Upsert)
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email_addresses?.[0]?.email_address,
        name,
        image: data.image_url,
      },
      create: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address,
        name,
        image: data.image_url,
      },
    });
  }
);

// 2. Update User
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses?.[0]?.email_address,
        name,
        image: data.image_url,
      },
    });
  }
);

// 3. Delete User
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await prisma.user
      .delete({ where: { id: event.data.id } })
      .catch(() => null);
  }
);

// 4. Sync Workspace (Upsert + Admin Member)
const syncWorkspaceCreation = inngest.createFunction(
  { id: "sync-workspace-from-clerk" },
  { event: "clerk/organization.created" }, // TYPO FIXED
  async ({ event }) => {
    const { data } = event;

    await prisma.$transaction(async (tx) => {
      // Upsert Workspace
      await tx.workspace.upsert({
        where: { id: data.id },
        update: {
          name: data.name,
          slug: data.slug,
          image_url: data.image_url,
        },
        create: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          ownerId: data.created_by,
          image_url: data.image_url,
        },
      });

      // Upsert Creator as Admin
      await tx.workspaceMember.upsert({
        where: {
          userId_workspaceId: { userId: data.created_by, workspaceId: data.id },
        },
        update: { role: "ADMIN" },
        create: {
          userId: data.created_by,
          workspaceId: data.id,
          role: "ADMIN",
        },
      });
    });
  }
);

// 5. Update Workspace
const syncWorkspaceUpdation = inngest.createFunction(
  { id: "update-workspace-from-clerk" },
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      },
    });
  }
);

// 6. Delete Workspace
const syncWorkspaceDeletion = inngest.createFunction(
  { id: "delete-workspace-with-clerk" },
  { event: "clerk/organization.deleted" },
  async ({ event }) => {
    await prisma.workspace
      .delete({ where: { id: event.data.id } })
      .catch(() => null);
  }
);

// 7. Sync Member (Create/Update)
const syncWorkspaceMemberCreation = inngest.createFunction(
  { id: "sync-workspace-member-from-clerk" },
  { event: "clerk/organizationMembership.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: {
          userId: data.public_user_data.user_id,
          workspaceId: data.organization.id,
        },
      },
      update: { role: getRole(data.role) },
      create: {
        userId: data.public_user_data.user_id,
        workspaceId: data.organization.id,
        role: getRole(data.role),
      },
    });
  }
);

// 8. Remove Member
const syncWorkspaceMemberDeletion = inngest.createFunction(
  { id: "delete-workspace-member-from-clerk" },
  { event: "clerk/organizationMembership.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspaceMember
      .delete({
        where: {
          userId_workspaceId: {
            userId: data.public_user_data.user_id,
            workspaceId: data.organization.id,
          },
        },
      })
      .catch(() => null);
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
  syncWorkspaceMemberDeletion,
];
