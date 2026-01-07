"use client";
import homy from "@/assets/homy.png";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getAdminProfile, updateAdminProfile } from "@/lib/features/auth/adminAuthApi";
import { AppDispatch } from "@/lib/store/store";
import logoutIcon from "@/assets/logoutIcon.png"
import mail from "@/assets/mail.svg"
import call from "@/assets/call.svg"
import camera from "@/assets/camera.svg"
import { resetAuth } from "@/lib/features/auth/adminAuthSlice";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: any;
  children: React.ReactNode;
}) {
  return (
    <div>
      <fieldset className="border px-4 pb-1.5 rounded-md">
        <legend className="text-xs px-1 font-semibold text-gray-700">
          {label}
        </legend>
        {children}
      </fieldset>
      {error && (
        <p className="text-[11px] text-red-500">This field is required</p>
      )}
    </div>
  );
}

export default function ProfileSettings() {
  const dispatch = useAppDispatch<AppDispatch>();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    countryCode,
    profileImage,
    profileLoading,
    role,
    profileError
  } = useAppSelector((state) => state.auth);

  const [preview, setPreview] = useState<string>(homy.src);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    dispatch(getAdminProfile());
  }, [dispatch]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (firstName || lastName || email || phoneNumber) {
      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phoneNumber: phoneNumber || "",
      });
    }
  }, [firstName, lastName, email, phoneNumber]);

  // Update preview when profile image changes
  useEffect(() => {
    if (profileImage && profileImage.trim() !== "") {
      setPreview(profileImage);
    } else {
      setPreview(homy.src);
    }
  }, [profileImage]);

  const handleEditClick = () => {
    fileRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedImage(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const updatePayload: { firstname?: string; profileImage?: File } = {};

      if (formData.firstName) {
        updatePayload.firstname = formData.firstName;
      }

      if (selectedImage) {
        updatePayload.profileImage = selectedImage;
      }

      await dispatch(updateAdminProfile(updatePayload)).unwrap();

      // Re-fetch profile to get updated data
      await dispatch(getAdminProfile()).unwrap();

      setSuccessMessage("Profile updated successfully!");
      setSelectedImage(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
    });
    setSelectedImage(null);

    // Reset preview to original image
    if (profileImage && profileImage.trim() !== "") {
      setPreview(profileImage);
    } else {
      setPreview(homy.src);
    }
  };

  const handleLogout = () => {
    dispatch(resetAuth());

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };


  return (
    <div className="bg-[#F5F5FA] md:bg-white">

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden py-4">
        <h2 className="mb-4 text-lg text-center font-semibold text-gray-900">
          Setting
        </h2>

        <div className="bg-white rounded-xl border py-4 px-5">

          {/* PROFILE IMAGE */}
          <div className="flex justify-center my-2">
            <div className="relative h-28 w-28 rounded-md overflow-hidden bg-gray-200">
              <Image
                src={preview}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* PROFILE TITLE */}
          <p className="mt-3 text-[20px] font-bold text-[#000000] text-left">
            Profile
          </p>

          <div className="mt-3">
            <p className="text-[14px] font-medium text-[#929292]">Full Name</p>
            <p className="text-[16px] text-black">
              {firstName} {lastName}
            </p>
          </div>


          {/* PHONE */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#929292]">Phone Number</p>
              <p className="text-[16px] text-black">
                {countryCode} {phoneNumber}
              </p>
            </div>

            {phoneNumber && (
              <a
                href={`tel:${countryCode}${phoneNumber}`}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-[#F5F5FA]"
              >
                <img
                  src={call.src}
                  alt="notification"
                  width={18}
                  height={18}
                />
              </a>
            )}
          </div>

          {/* EMAIL */}
          <div className="mt-3 flex items-center justify-between">
            <div className="pr-2">
              <p className="text-[14px] font-medium text-[#929292]">Email</p>
              <p className="text-[16px] text-black break-all">
                {email}
              </p>
            </div>

            <a
              href={`mailto:${email}`}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-[#F5F5FA]"
            >
              <img
                src={mail.src}
                alt="notification"
                width={18}
                height={18}
              />
            </a>
          </div>

          {/* ROLE */}
          <div className="mt-3">
            <p className="text-[14px] font-medium text-[#929292]">Role</p>
            <p className="text-[16px] text-black">
              {role?.name || "Admin"}
            </p>
          </div>

        </div>


        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-12 w-full flex items-center justify-center gap-2 rounded-lg bg-[#CA111A] py-3 text-sm font-semibold text-white">
          Logout
          <img
            src={logoutIcon.src}
            alt="notification"
            width={18}
            height={18}
          />
        </button>

      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block mx-auto w-full">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Edit General Setting
        </h2>

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        )}

        {profileError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-800">{profileError}</p>
          </div>
        )}

        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="relative h-[150px] w-[150px] rounded-2xl overflow-hidden bg-gray-200">
                <Image
                  src={preview}
                  alt="Profile"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>

              <button
                type="button"
                onClick={handleEditClick}
                disabled={profileLoading || isSubmitting}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2
             rounded-md bg-gray-900 border border-gray-600
             px-3 py-1.5 min-w-[110px]
             text-xs text-white
             disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src={camera}
                  alt="edit"
                  width={16}
                  height={16}
                  className="object-cover object-center"
                />
                <span className="whitespace-nowrap">Edit Profile</span>
              </button>




              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={profileLoading || isSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="First Name*">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter Your First name"
                className="w-full rounded-lg outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={profileLoading || isSubmitting}
              />
            </Field>

            <Field label="Last Name*">
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter Your Last Name"
                className="w-full rounded-lg outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={profileLoading || isSubmitting}
              />
            </Field>

            <Field label="Email Address*">
              <input
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter Your Email Address"
                className="w-full rounded-lg outline-none text-sm  cursor-not-allowed"
                disabled
                readOnly
              />
            </Field>

            <Field label="Phone Number*">
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Enter Your Phone Number"
                className="w-full rounded-lg outline-none text-sm cursor-not-allowed"
                disabled
                readOnly
              />
            </Field>

            <Field label="Role">
              <input
                name="role"
                value={role?.name || "Admin"}
                className="w-full rounded-lg outline-none text-sm cursor-not-allowed"
                disabled
                readOnly
              />
            </Field>

          </div>

          <div className="flex justify-end gap-3 pt-8">
            <button
              type="button"
              onClick={handleCancel}
              disabled={profileLoading || isSubmitting}
              className="rounded-lg border px-5 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>

            <button
              type="submit"
              disabled={profileLoading || isSubmitting}
              className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
