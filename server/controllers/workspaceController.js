import prisma from "../configs/prisma.js";

// Get all workspaces for user
export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = req.auth; // Corrected access

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: userId },
        },
      },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: {
              include: {
                assignee: true,
                comments: { include: { user: true } },
              },
            },
            members: { include: { user: true } },
          },
        },
        owner: true,
      },
    });
    res.json({ workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Add member to workspace (Manual Override)
export const addMember = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { email, role, workspaceId, message } = req.body;

    // 1. Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Validate Inputs
    if (!workspaceId || !role)
      return res.status(400).json({ message: "Missing required parameters" });
    if (!["ADMIN", "MEMBER"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    // 3. Fetch Workspace & Check Permissions
    // TYPO FIXED: 'prism' -> 'prisma'
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isAdmin = workspace.members.some(
      (m) => m.userId === userId && m.role === "ADMIN"
    );
    if (!isAdmin)
      return res.status(401).json({ message: "You do not have permission" });

    // 4. Add Member
    // Use upsert to handle race conditions
    const member = await prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
      update: { role, message },
      create: {
        userId: user.id,
        workspaceId,
        role,
        message,
      },
    });

    res.json({ member, message: "Member added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
