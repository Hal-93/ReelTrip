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
import TaskBar from "~/components/taskbar/taskbar";

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
  const isAnalyzeDisabled = !selectedFile || isAnalyzing;
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [aiResult, setAiResult] = useState<string | null>(null);
  const [genre, setGenre] = useState<string>("N");

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

    let info = exifInfo;
    if (!info) {
      info = await extractBasicExif(selectedFile);
      setExifInfo(info);
      if (!info) {
        setExifError("EXIF情報が見つかりませんでした。");
      }
    }

    console.log("AI start");
    let result: string | null = null;
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);

      const res = await fetch("/api/ai", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      result = data.result ?? null;

      console.log("AI解析結果:", result);
      setAiResult(result);

      if (typeof result === "string") {
        try {
          const cleaned = result
            .replace(/```json/i, "")
            .replace(/```/g, "")
            .trim();
          const parsed: { genre?: string } = JSON.parse(cleaned);
          if (parsed.genre) setGenre(parsed.genre);
        } catch {
          // パース失敗時は無視
        }
      }

      if (info && result) {
        (info as Record<string, string | number>)["AI Result"] =
          typeof result === "string" ? result : String(result);
      }
    } catch (e) {
      console.error("AI解析エラー", e);
    }

    setIsExifOpen(true);

    setIsAnalyzing(false);
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
    formData.append("genre", genre);

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

  const isQualityBad = (() => {
    if (!aiResult) return false;
    try {
      const cleaned = aiResult
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      return parsed.quality === false;
    } catch {
      return false;
    }
  })();

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
              disabled={isAnalyzeDisabled}
              className={`w-full mb-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
                isAnalyzeDisabled
                  ? "opacity-50 cursor-not-allowed hover:bg-gray-100"
                  : ""
              }`}
            >
              画像を確認
            </button>
          </>
        ) : (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-700 text-sm">
              画像を確認しています
            </span>
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
          <div className="mt-4">
            <label className="block text-sm mb-1">この画像のジャンル</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full border rounded-sm p-2 text-sm"
            >
              <option value="N">なし</option>
              <option value="A">アクティビティ</option>
              <option value="S">景色</option>
              <option value="G">食事</option>
            </select>
            <p>※AIが判断した結果が表示されています。修正が可能です。</p>
          </div>
          {isQualityBad ? (
            <>
              この画像は品質基準を満たしていないため投稿できません。
              <br />
              詳しくは投稿ガイドをご確認ください。
            </>
          ) : (
            <>
              この画像はアップロードできます
              <br />
            </>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading || isQualityBad}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-sm transition-colors duration-200 ${
              isUploading || isQualityBad
                ? "opacity-50 cursor-not-allowed hover:bg-blue-600"
                : ""
            }`}
          >
            {isQualityBad
              ? "アップロード不可"
              : isUploading
                ? "アップロード中..."
                : "アップロード"}
          </button>
        </DialogContent>
      </Dialog>
      <TaskBar />
    </div>
  );
}
