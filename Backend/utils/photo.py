import requests
from bs4 import BeautifulSoup
import os
import re
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

def scrape_images(keyword, num_images=4):
    search_url = f"https://www.bing.com/images/search?q={keyword.replace(' ', '+')}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    }
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        image_elements = soup.find_all('a', {'class': 'iusc'})
        image_urls = []
        for elem in image_elements:
            if len(image_urls) >= num_images:
                break
            m = re.search(r'"murl":"(.*?)"', elem['m']) # type: ignore
            if m:
                image_urls.append(m.group(1))
        os.makedirs('downloaded_images', exist_ok=True)
        filenames = []
        for i, url in enumerate(image_urls[:num_images]):
            try:
                img_data = requests.get(url, headers=headers, timeout=5).content
                filename = f'downloaded_images/{keyword}_{i+1}.jpg'
                with open(filename, 'wb') as f:
                    f.write(img_data)
                filenames.append(filename)
            except Exception:
                continue
        return filenames
    except Exception as e:
        raise RuntimeError(str(e))

@router.get("/scrape-images")
def scrape_images_endpoint(keyword: str = Query(..., description="Search keyword"), num_images: int = Query(4, ge=1, le=20)):
    try:
        filenames = scrape_images(keyword, num_images)
        if not filenames:
            raise HTTPException(status_code=404, detail="No images found or downloaded.")
        return JSONResponse(content={"downloaded": filenames})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
