/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { userService } from "@/lib/services/user.service";
import { DataTable, Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/formatters";
import { UserManagement } from "@/types/user.types";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function UsersManagement() {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "store-owner" as "super-admin" | "store-owner",
    status: "active" as "active" | "inactive",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    userService.initialize();
    setTimeout(() => {
      setUsers(userService.getAll());
      setIsLoading(false);
    }, 100);
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "store-owner",
      status: "active",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!selectedUser && users.some((u) => u.email === formData.email)) {
      newErrors.email = "This email is already registered";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateClick = () => {
    resetForm();
    setSelectedUser(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (user: UserManagement) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: (user.status === "active" || user.status === "inactive"
        ? user.status
        : "active") as "active" | "inactive",
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = userService.create({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      });

      if (result.success) {
        setUsers(userService.getAll());
        setCreateDialogOpen(false);
        toast.success(`User "${formData.name}" created successfully`);
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateForm() || !selectedUser) return;

    setIsSubmitting(true);
    try {
      const result = userService.update(selectedUser.id, formData);
      if (result.success) {
        setUsers(userService.getAll());
        setEditDialogOpen(false);
        toast.success(`User "${formData.name}" updated successfully`);
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user: UserManagement) => {
    if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
      userService.delete(user.id);
      setUsers(userService.getAll());
      toast.success("User deleted");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const columns: Column<UserManagement>[] = [
    {
      key: "name",
      label: "Name",
      render: (user) => (
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge variant={user.role === "super-admin" ? "default" : "outline"}>
          {user.role === "super-admin" ? "Super Admin" : "Store Owner"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <Badge
          variant={user.status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          {user.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditClick(user)}
            className="transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteUser(user)}
            className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const adminCount = users.filter((u) => u.role === "super-admin").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users and their roles
          </p>
        </div>
        <Button
          onClick={handleCreateClick}
          className="transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New User
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-3xl font-bold">{adminCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-3xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Roles</option>
              <option value="super-admin">Super Admin</option>
              <option value="store-owner">Store Owner</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage all platform users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <DataTable<UserManagement> data={filteredUsers} columns={columns} />
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={formErrors.name ? "border-destructive" : ""}
                placeholder="John Doe"
              />
              {formErrors.name && (
                <p className="text-xs text-destructive mt-1">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={formErrors.email ? "border-destructive" : ""}
                placeholder="john@example.com"
                type="email"
              />
              {formErrors.email && (
                <p className="text-xs text-destructive mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="store-owner">Store Owner</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={isSubmitting}
              className="transition-all duration-200"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <p className="text-xs text-destructive mt-1">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="store-owner">Store Owner</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="transition-all duration-200"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
