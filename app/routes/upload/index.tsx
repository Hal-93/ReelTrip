import React, { useRef, useState } from "react";
import * as exifr from "exifr";
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
  const [exifInfo, setExifInfo] = useState<Record<
    string,
    string | number
  > | null>(null);
  const [exifError, setExifError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === "undefined") return;

    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith(".heic")) {
      try {
        const arrayBuffer = await file.arrayBuffer();

        const meta = await exifr.parse(arrayBuffer, {
          tiff: true,
          exif: true,
          gps: true,
        });

        const { default: heic2any } = await import("heic2any");
        const result = await heic2any({
          blob: new Blob([arrayBuffer]),
          toType: "image/jpeg",
        });
        const convertedBlob = Array.isArray(result) ? result[0] : result;
        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.heic$/i, ".jpg"),
          {
            type: "image/jpeg",
          },
        );
        setSelectedFile(convertedFile);

        setIsPreviewLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
          setIsPreviewLoading(false);
        };
        reader.readAsDataURL(convertedFile);

        const normalized: Record<string, string | number> = {};
        if (meta?.latitude && meta?.longitude) {
          normalized["GPSLatitude(dec)"] = meta.latitude;
          normalized["GPSLongitude(dec)"] = meta.longitude;
          normalized["GPS"] = `${meta.latitude}, ${meta.longitude}`;
        } else {
          normalized["GPS"] = "情報なし";
        }

        if (meta?.Make) normalized["Make"] = meta.Make;
        if (meta?.Model) normalized["Model"] = meta.Model;
        if (meta?.DateTimeOriginal)
          normalized["撮影日時(DateTimeOriginal)"] = String(
            meta.DateTimeOriginal,
          );

        if (!meta?.ExifImageWidth && !meta?.imageWidth) {
          const image = new Image();
          const blobUrl = URL.createObjectURL(convertedBlob);
          await new Promise((resolve) => {
            image.onload = () => {
              normalized["Image Width"] = image.width;
              normalized["Image Height"] = image.height;
              URL.revokeObjectURL(blobUrl);
              resolve(null);
            };
            image.src = blobUrl;
          });
        } else {
          normalized["Image Width"] =
            meta.ExifImageWidth ?? meta.imageWidth ?? "情報なし";
          normalized["Image Height"] =
            meta.ExifImageHeight ?? meta.imageHeight ?? "情報なし";
        }

        setExifInfo(normalized);
        setExifError(null);
      } catch (err) {
        console.error("HEIC変換エラー:", err);
        setMessage("HEIC画像の変換またはEXIF抽出に失敗しました。");
        setSelectedFile(null);
      }
      return;
    }

    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      setIsPreviewLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPreviewUrl(reader.result as string);
        setIsPreviewLoading(false);
        try {
          const arrayBuffer = await file.arrayBuffer();
          const meta = await exifr.parse(arrayBuffer, {
            tiff: true,
            exif: true,
            gps: true,
          });
          console.log("EXIF data:", meta);

          const normalized: Record<string, string | number> = {};
          if (meta?.latitude && meta?.longitude) {
            normalized["GPSLatitude(dec)"] = meta.latitude;
            normalized["GPSLongitude(dec)"] = meta.longitude;
            normalized["GPS"] = `${meta.latitude}, ${meta.longitude}`;
          } else {
            normalized["GPS"] = "情報なし";
          }

          normalized["Make"] = meta?.Make ?? "情報なし";
          normalized["Model"] = meta?.Model ?? "情報なし";
          normalized["撮影日時(DateTimeOriginal)"] = meta?.DateTimeOriginal
            ? String(meta.DateTimeOriginal)
            : "情報なし";

          if (!meta?.ExifImageWidth && !meta?.imageWidth) {
            const image = new Image();
            const blobUrl = URL.createObjectURL(file);
            await new Promise((resolve) => {
              image.onload = () => {
                normalized["Image Width"] = image.width;
                normalized["Image Height"] = image.height;
                URL.revokeObjectURL(blobUrl);
                resolve(null);
              };
              image.src = blobUrl;
            });
          } else {
            normalized["Image Width"] =
              meta.ExifImageWidth ?? meta.imageWidth ?? "情報なし";
            normalized["Image Height"] =
              meta.ExifImageHeight ?? meta.imageHeight ?? "情報なし";
          }

          setExifInfo(normalized);
          setExifError(null);
        } catch (err) {
          console.error("EXIF抽出エラー:", err);
          setExifInfo(null);
          setExifError("EXIF情報の抽出に失敗しました。");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  type ExifrMeta = Partial<{
    latitude: number;
    longitude: number;
    GPSLatitude: number[];
    GPSLongitude: number[];
    Make: string;
    Model: string;
    DateTimeOriginal: Date | string;
    CreateDate: Date | string;
    ModifyDate: Date | string;
    ExifImageWidth: number;
    ExifImageHeight: number;
    imageWidth: number;
    imageHeight: number;
    Orientation: string;
    FileType: string;
  }>;

  const extractBasicExif = async (
    file: File,
  ): Promise<Record<string, string | number> | null> => {
    const arrayBuffer = await file.arrayBuffer();

    let meta: ExifrMeta | null = null;
    try {
      meta = await exifr.parse(arrayBuffer, {
        tiff: true,
        exif: true,
        gps: true,
        mergeOutput: true,
      });
      console.log("EXIF meta:", meta);
    } catch (err) {
      console.error("EXIF読み込みエラー:", err);
      return null;
    }

    if (!meta) return null;

    const normalized: Record<string, string | number> = {};

    const lat = meta.latitude ?? meta.GPSLatitude;
    const lon = meta.longitude ?? meta.GPSLongitude;
    if (lat && lon) {
      const toDecimal = (val: number | number[]): number => {
        if (Array.isArray(val) && typeof val[0] === "number")
          return val[0] + val[1] / 60 + val[2] / 3600;
        return typeof val === "number" ? val : Number(val);
      };
      normalized["GPSLatitude(dec)"] = toDecimal(lat);
      normalized["GPSLongitude(dec)"] = toDecimal(lon);
      normalized["GPS"] = `${toDecimal(lat)}, ${toDecimal(lon)}`;
    } else {
      normalized["GPS"] = "情報なし";
    }

    const formatDate = (val?: Date | string) => {
      if (!val) return "情報なし";
      try {
        return new Date(val).toLocaleString();
      } catch {
        return String(val);
      }
    };

    normalized["撮影日時(DateTimeOriginal)"] = formatDate(
      meta.DateTimeOriginal,
    );
    normalized["デジタル化日時(DateTimeDigitized)"] = formatDate(
      meta.CreateDate,
    );
    normalized["更新日時(DateTime)"] = formatDate(meta.ModifyDate);

    if (!meta?.ExifImageWidth && !meta?.imageWidth) {
      const image = new Image();
      const blobUrl = URL.createObjectURL(file);
      await new Promise((resolve) => {
        image.onload = () => {
          normalized["Image Width"] = image.width;
          normalized["Image Height"] = image.height;
          URL.revokeObjectURL(blobUrl);
          resolve(null);
        };
        image.src = blobUrl;
      });
    } else {
      normalized["Image Width"] =
        meta.ExifImageWidth ?? meta.imageWidth ?? "情報なし";
      normalized["Image Height"] =
        meta.ExifImageHeight ?? meta.imageHeight ?? "情報なし";
    }
    normalized["Make"] = meta.Make ?? "情報なし";
    normalized["Model"] = meta.Model ?? "情報なし";
    normalized["Orientation"] = meta.Orientation ?? "情報なし";
    normalized["FileType"] = meta.FileType ?? "jpeg";

    return Object.keys(normalized).length > 0 ? normalized : null;
  };

  const handleAnalyze = async () => {
    setExifError(null);
    setIsAnalyzing(true);

    if (!selectedFile) {
      setExifInfo(null);
      setExifError("ファイルが選択されていません。");
      setIsExifOpen(true);
      setIsAnalyzing(false);
      return;
    }

    if (exifInfo) {
      setIsExifOpen(true);
      setIsAnalyzing(false);
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
    } finally {
      setIsAnalyzing(false);
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

    if (exifInfo) {
      if (exifInfo["GPSLatitude(dec)"] !== undefined) {
        formData.append("lat", String(exifInfo["GPSLatitude(dec)"]));
      }
      if (exifInfo["GPSLongitude(dec)"] !== undefined) {
        formData.append("lng", String(exifInfo["GPSLongitude(dec)"]));
      }
      if (exifInfo["Image Width"] !== undefined) {
        formData.append("width", String(exifInfo["Image Width"]));
      }
      if (exifInfo["Image Height"] !== undefined) {
        formData.append("height", String(exifInfo["Image Height"]));
      }
      if (exifInfo["撮影日時(DateTimeOriginal)"] !== undefined) {
        formData.append("date", String(exifInfo["撮影日時(DateTimeOriginal)"]));
      }
      formData.append("price", "0");
    }

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
        {isPreviewLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-700 text-sm">
              プレビューを生成中...
            </span>
          </div>
        ) : (
          previewUrl && (
            <div className="mb-6 flex justify-center rounded-sm border border-gray-300 overflow-hidden max-w-xs max-h-72">
              <img
                src={previewUrl}
                alt="Preview"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          )
        )}
        {message && (
          <p className="mb-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
        {!isAnalyzing ? (
          <>
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
          </>
        ) : (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-700 text-sm">分析中...</span>
          </div>
        )}
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
            <p className="text-sm text-muted-foreground">
              情報はありませんでした。
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
