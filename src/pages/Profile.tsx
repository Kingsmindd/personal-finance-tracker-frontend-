import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  User,
  X,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import {
  profileSchema,
  type ProfileFormData,
} from "../validations/auth.schema";
import SettingsLayout, { SettingsNotice } from "../components/SettingsLayout";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();


  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
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

  useEffect(() => {
    if (!error && !success) return;
    const timer = window.setTimeout(() => { setError(""); setSuccess(""); }, error ? 7000 : 5000);
    return () => window.clearTimeout(timer);
  }, [error, success]);

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
      setSuccess("");

      const response = await api.patch("/auth/profile", {
        name: data.name,
      });

      const updatedUser = response.data.user;

      updateUser({ ...user, ...updatedUser });
      setSuccess("Your profile has been updated.");

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
    <SettingsLayout title="Your profile." description="Keep your personal details up to date." icon={User}>
      <SettingsNotice message={success} />
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6"><div><h2 className="font-semibold text-gray-900 dark:text-white">Personal information</h2><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your name appears throughout your account.</p></div>{!isEditing && <button type="button" onClick={handleEdit} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-blue-950/30"><Pencil size={16} />Edit name</button>}</header>
        <div className="p-5 sm:p-6">{isEditing ? <form onSubmit={handleSubmit(handleSave)} className="space-y-5"><div><label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">Your name</label><input id="profile-name" autoComplete="name" {...register("name")} disabled={isSubmitting} aria-invalid={!!errors.name} className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-900" />{errors.name && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}</div><SettingsNotice message={error} error /><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={isSubmitting} onClick={handleCancel} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"><X size={16} />Cancel</button><button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"><Check size={16} />{isSubmitting ? "Saving…" : "Save changes"}</button></div></form> : <div><p className="text-xs text-gray-500 dark:text-gray-400">Your name</p><p className="mt-2 break-words text-base font-semibold text-gray-900 dark:text-white">{user.name || "Not provided"}</p></div>}<div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800"><p className="text-xs text-gray-500 dark:text-gray-400">Email address</p><p className="mt-2 break-all text-sm font-medium text-gray-800 dark:text-gray-200">{user.email}</p><p className="mt-2 text-xs text-gray-400">Your sign-in email cannot be changed here.</p></div></div>
      </section>
    </SettingsLayout>
  );
};

export default Profile;
