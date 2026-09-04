import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Pencil,
  ShieldCheck,
  User,
  X,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import {
  profileSchema,
  type ProfileFormData,
} from "../validations/auth.schema";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
    });
  }, [user?.name, reset]);

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setError("");

    reset({
      name: user.name || "",
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setError("");

    reset({
      name: user.name || "",
    });

    setIsEditing(false);
  };

  const handleSave = async (data: ProfileFormData) => {
    try {
      setError("");

      const response = await api.patch("/auth/profile", {
        name: data.name,
      });

      const updatedUser = response.data.user;

      if (token) {
        login(token, updatedUser);
      }

      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Profile update failed:", error);

      setError(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          "Failed to update profile. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>Back to Settings</span>
          </button>
        </div>
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal account information.
          </p>
        </div>

        {/* Profile Header */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <User className="h-8 w-8" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                  {user.name || "User"}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Pencil className="h-4 w-4" />
                Edit profile
              </button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>
          </div>

          <div className="px-6 py-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(handleSave)} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    {...register("name")}
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your name"
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="mt-2 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  />

                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Email changes are not available yet.
                  </p>
                </div>

                {/* API Error */}
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    <Check className="h-4 w-4" />

                    {isSubmitting ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email address
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account */}
        {/* Account */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Account
            </h2>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Account status
              </p>

              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-green-600" />

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
