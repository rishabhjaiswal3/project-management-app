import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import AuthWrapper from "@/wrapper/AuthWrapper";
import Image from "next/image";

interface UserProfile {
  name: string;
  email: string;
  image: string;
  password?: string;
}

const Profile = () => {
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? ""); // Email is non-editable
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(session?.user?.image ?? "/profile.webp");

  const updateProfile = api.user.updateProfile.useMutation();
  const { data: user } = api.user.getProfile.useQuery();

  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = (await toBase64(file));
      setImage(base64);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setImage(user?.image ?? "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    alert(
      "We are not updating the image. For that, we need to integrate an S3 bucket. Due to time constraints, we are using a base64 image, but it is not being uploaded."
    );
    e.preventDefault();

    const data: UserProfile = { name, email, image: "" };
    if (password) {
      data.password = password;
    }
    const res = await updateProfile.mutateAsync(data);
    console.log("res", res);
    setPassword("");
    alert("Profile updated successfully!");
  };

  return (
    <AuthWrapper>
      <div className="mx-auto mt-40 max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="mt-2 flex items-center">
              <Image
                src={image}
                alt="Profile"
                width={64}
                height={64}
                className="mr-4 h-16 w-16 rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm sm:text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              placeholder="Enter a new password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
};

export default Profile;