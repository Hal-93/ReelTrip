"use client";

import React, { useRef, useState } from "react";
import * as ExifReader from "exifreader";
import { getUser } from "~/lib/models/auth.server";
import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }

  return { user };
}

export default function Upload() {
  const { user } = useLoaderData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExifOpen, setIsExifOpen] = useState(false);
  const [exifInfo, setExifInfo] = useState<Record<string, string | number> | null>(null);
  const [exifError, setExifError] = useState<string | null>(null);
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

  const extractBasicExif = async (file: File): Promise<Record<string, string | number> | null> => {
    const arrayBuffer = await file.arrayBuffer();
    const tags = await ExifReader.load(arrayBuffer);
    const normalized: Record<string, string | number> = {};

    const latTag = tags.GPSLatitude || tags.gpsLatitude;
    const lonTag = tags.GPSLongitude || tags.gpsLongitude;
    const latRef = tags.GPSLatitudeRef || tags.gpsLatitudeRef;
    const lonRef = tags.GPSLongitudeRef || tags.gpsLongitudeRef;

    const toDecimal = (values: number[], ref?: string) => {
      const [deg, min, sec] = values;
      let dec = deg + min / 60 + sec / 3600;
      if (ref && (ref === "S" || ref === "W")) {
        dec = -dec;
      }
      return dec;
    };

    const normalizeGpsArray = (raw: unknown): number[] | null => {
      if (!Array.isArray(raw)) return null;
      if (raw.length > 0 && typeof raw[0] === "number") {
        return raw as number[];
      }
      const nums: number[] = [];
      for (const part of raw) {
        if (Array.isArray(part) && typeof part[0] === "number") {
          nums.push(part[0]);
        } else {
          return null;
        }
      }
      return nums.length ? nums : null;
    };

    const latArr = latTag ? normalizeGpsArray(latTag.value) : null;
    const lonArr = lonTag ? normalizeGpsArray(lonTag.value) : null;

    if (latArr && lonArr) {
      const lat = toDecimal(latArr, latRef?.value as string | undefined);
      const lon = toDecimal(lonArr, lonRef?.value as string | undefined);
      normalized["GPSLatitude(dec)"] = lat;
      normalized["GPSLongitude(dec)"] = lon;
      normalized["GPS"] = `${lat}, ${lon}`;
    } else {
      normalized["GPS"] = "情報なし";
    }

    const dto = (tags.DateTimeOriginal || tags.dateTimeOriginal)?.description || (tags.DateTimeOriginal || tags.dateTimeOriginal)?.value;
    const dtd = (tags.DateTimeDigitized || tags.dateTimeDigitized)?.description || (tags.DateTimeDigitized || tags.dateTimeDigitized)?.value;
    const dt  = (tags.DateTime || tags.dateTime)?.description || (tags.DateTime || tags.dateTime)?.value;

    if (dto) {
      normalized["撮影日時(DateTimeOriginal)"] = String(dto);
    }
    if (dtd) {
      normalized["デジタル化日時(DateTimeDigitized)"] = String(dtd);
    }
    if (dt) {
      normalized["更新日時(DateTime)"] = String(dt);
    }

    for (const [key, tag] of Object.entries(tags)) {
      if (!tag) continue;
      if (key === "GPSLatitude" || key === "gpsLatitude" || key === "GPSLongitude" || key === "gpsLongitude" || key === "GPSLatitudeRef" || key === "gpsLatitudeRef" || key === "GPSLongitudeRef" || key === "gpsLongitudeRef") {
        continue;
      }
      if (typeof tag.value === "string" || typeof tag.value === "number") {
        normalized[key] = tag.value;
      } else if (Array.isArray(tag.value)) {
        const arr = tag.value as unknown[];
        normalized[key] = arr.map((v) => (typeof v === "string" || typeof v === "number" ? v : String(v))).join(", ");
      } else if (tag.description) {
        normalized[key] = tag.description;
      } else {
        normalized[key] = "[unsupported]";
      }
    }
    const requiredKeys = [
      "GPS",
      "撮影日時(DateTimeOriginal)",
      "デジタル化日時(DateTimeDigitized)",
      "更新日時(DateTime)",
      "Image Width",
      "Image Height",
      "FileType",
      "Make",
      "Model",
      "Orientation",
    ];
    for (const k of requiredKeys) {
      if (!(k in normalized)) {
        normalized[k] = "情報なし";
      }
    }
    return Object.keys(normalized).length > 0 ? normalized : null;
  };

  const handleAnalyze = async () => {
    setExifError(null);
    if (!selectedFile) {
      setExifInfo(null);
      setExifError("ファイルが選択されていません。");
      setIsExifOpen(true);
      return;
    }
    try {
      const info = await extractBasicExif(selectedFile);
      setExifInfo(info);
      if (!info) {
        setExifError("EXIF情報が見つかりませんでした。");
      }
      setIsExifOpen(true);
    } catch (err) {
      setExifInfo(null);
      setExifError(err instanceof Error ? err.message : "解析に失敗しました。");
      setIsExifOpen(true);
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
      setMessage(
        "アップロード中にエラーが発生しました: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">アップロード</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-sm shadow-md"
      >
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
          <div className="mb-6 flex justify-center rounded-sm border border-gray-300 overflow-hidden max-w-xs max-h-72">
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
          type="button"
          onClick={handleAnalyze}
          className="w-full mb-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          分析
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-sm transition-colors duration-200 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isUploading ? "アップロード中..." : "アップロード"}
        </button>
      </form>
      <Dialog open={isExifOpen} onOpenChange={setIsExifOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>EXIF情報</DialogTitle>
          </DialogHeader>
          {exifError ? (
            <p className="text-sm text-red-500 mb-2">{exifError}</p>
          ) : null}
          {exifInfo ? (
            <ul className="text-sm space-y-1">
              {Object.entries(exifInfo).map(([key, value]) => (
                <li key={key} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-mono break-all">{String(value)}</span>
                </li>
              ))}
            </ul>
          ) : !exifError ? (
            <p className="text-sm text-muted-foreground">情報はありませんでした。</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}