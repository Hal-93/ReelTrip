import os
import uuid
import subprocess
import io
from datetime import timedelta
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from minio import Minio
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === MinIO internal (server → MinIO) ===
minio_internal = Minio(
    os.environ["MINIO_INTERNAL_ENDPOINT"],
    access_key=os.environ["MINIO_ACCESS_KEY"],
    secret_key=os.environ["MINIO_SECRET_KEY"],
    secure=False
)

# === MinIO public (browser → MinIO via Nginx) ===
minio_public = Minio(
    os.environ["MINIO_PUBLIC_ENDPOINT"],
    access_key=os.environ["MINIO_ACCESS_KEY"],
    secret_key=os.environ["MINIO_SECRET_KEY"],
    secure=True
)

class VideoRequest(BaseModel):
    keys: list[str]

@app.get("/list-objects")
def list_objects():
    objects = minio_internal.list_objects(os.environ["MINIO_BUCKET"], "", recursive=False)

    result = []
    for obj in objects:
        name = getattr(obj, "object_name", "")
        if name and not name.endswith("/"):
            result.append(name)

    return result

@app.post("/make-video")
def make_video(req: VideoRequest):
    keys = req.keys
    try:
        img_paths = []
        for k in keys:
            data = minio_internal.get_object(os.environ["MINIO_BUCKET"], k)
            content = data.read()
            data.close()

            p = f"/tmp/{uuid.uuid4()}.jpg"
            with open(p, "wb") as f:
                f.write(content)
            img_paths.append(p)

        list_path = f"/tmp/{uuid.uuid4()}.txt"
        with open(list_path, "w") as f:
            for p in img_paths:
                f.write(f"file '{p}'\n")
                f.write("duration 3\n")
            f.write(f"file '{img_paths[-1]}'\n")

        video_path = f"/tmp/{uuid.uuid4()}.mp4"

        cmd = [
            "ffmpeg",
            "-f", "concat",
            "-safe", "0",
            "-i", list_path,
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "28",
            "-pix_fmt", "yuv420p",
            video_path
        ]

        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if not os.path.exists(video_path) or os.path.getsize(video_path) == 0:
            raise RuntimeError("ffmpeg failed to produce video. Is ffmpeg installed?")

        with open(video_path, "rb") as f:
            video_bytes = f.read()

        output_key = f"reels/{uuid.uuid4()}.mp4"
        minio_internal.put_object(
            os.environ["MINIO_BUCKET"],
            output_key,
            data=io.BytesIO(video_bytes),
            length=len(video_bytes),
            content_type="video/mp4"
        )
        presigned_url = minio_public.presigned_get_object(
            os.environ["MINIO_BUCKET"],
            output_key,
            expires=timedelta(minutes=10)
        )
        return {"video_key": output_key, "video_url": presigned_url}

    except Exception as e:
        return {"error": str(e)}