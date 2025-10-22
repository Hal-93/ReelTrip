"use client"

import React, { useRef, useState } from "react"
import type { User } from "@prisma/client";

interface UploadProps {
    user: User;
}

export default function Upload({ user }: UploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!selectedFile) {
      setMessage("No file selected.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          "x-user-id": user.id,
        },
      });

      if (response.ok) {
        setMessage("ファイルのアップロードに成功しました。");
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage("ファイルのアップロードに失敗しました。");
      }
    } catch (error) {
      setMessage("アップロード中にエラーが発生しました: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">アップロード</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-4">
          <span className="sr-only">Choose an image file</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </label>
        {previewUrl && (
          <div className="mb-6 flex justify-center rounded-md border border-gray-300 overflow-hidden max-w-xs max-h-72">
            <img
              src={previewUrl}
              alt="Preview"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        )}
        {message && (
          <p className="mb-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isUploading ? "アップロード中..." : "アップロード"}
        </button>
      </form>
    </div>
  );
}