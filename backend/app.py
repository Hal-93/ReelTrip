import os
from fastapi import FastAPI
from minio import Minio
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

client = Minio(
    os.environ["MINIO_ENDPOINT"],
    access_key=os.environ["MINIO_ACCESS_KEY"],
    secret_key=os.environ["MINIO_SECRET_KEY"],
    secure=os.environ.get("USE_SSL", "false") == "true"
)

@app.get("/fetch-image")
def fetch_image(key: str):
    try:
        data = client.get_object(os.environ["MINIO_BUCKET"], key)
        content = data.read()
        data.close()

        with open("sample.jpg", "wb") as f:
            f.write(content)

        return {"saved": True}
    except Exception as e:
        return {"error": str(e)}