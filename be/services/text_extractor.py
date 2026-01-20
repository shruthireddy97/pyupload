import os
import sys
from PIL import Image
from PyPDF2 import PdfReader
from docx import Document
from pathlib import Path
import easyocr

# Image text extraction via web API (lightweight alternative to OCR)
# Using free online OCR service as fallback
ONLINE_OCR_AVAILABLE = True


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PdfReader(file_path)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""


def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""


def extract_text_from_doc(file_path: str) -> str:
    """
    Extract text from older DOC format (binary format)
    Note: Requires python-docx which primarily supports DOCX
    For .doc files, pytesseract might be needed or an external library
    """
    try:
        # For .doc files (older format), we need a different approach
        # Using pytesseract as fallback if available
        import subprocess
        result = subprocess.run(
            ['python', '-m', 'docx2txt.process', file_path],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except Exception as e:
        print(f"Error extracting text from DOC: {e}")
    return ""


def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from image using OCR.Space API with custom API key
    No local installation required!
    Uses API key from https://forum.ui.vision/c/ocr-api/10
    """
    try:
        reader = easyocr.Reader(['en'], gpu=False)
        results = reader.readtext(file_path)
        text = " ".join([res[1] for res in results])
        print(text,'text....')
        return text.strip()
        # import requests
        
        # print(f"Processing image: {file_path}")
        
        # # Get API key from environment variable or use default
        # api_key = os.getenv('OCR_API_KEY', 'K84587077488957')
        
        # print(f"Attempting OCR.Space API...")
        
        # with open(file_path, 'rb') as f:
        #     response = requests.post(
        #         'https://api.ocr.space/parse',
        #         files={'filename': f},
        #         data={
        #             'apikey': api_key,
        #             'language': 'eng',
        #         },
        #         timeout=30
        #     )
        
        # print(f"API Response Status: {response.status_code}")
        
        # if response.status_code != 200:
        #     raise Exception(f"OCR API returned status {response.status_code}")
        
        # try:
        #     result = response.json()
        # except Exception as json_err:
        #     print(f"Failed to parse JSON: {json_err}")
        #     print(f"Response text: {response.text[:500]}")
        #     raise Exception("Invalid response from OCR API")
        
        # if result.get('IsErroredOnProcessing'):
        #     error_msg = result.get('ErrorMessage', 'Unknown OCR error')
        #     print(f"OCR Processing Error: {error_msg}")
        #     raise Exception(f"OCR processing failed: {error_msg}")
        
        # text = result.get('ParsedText', '').strip()
        
        # if text:
        #     print("✓ Text extracted successfully")
        #     return text
        # else:
        #     raise Exception("No text could be extracted from the image")
        
    except ImportError:
        raise Exception(
            "Image text extraction requires 'requests' library. "
            "Please install it: pip install requests"
        )
    except Exception as e:
        error_msg = str(e)
        print(f"Error extracting text from image: {error_msg}")
        raise Exception(f"Image text extraction failed: {error_msg}")





def extract_text(file_path: str) -> str:
    """
    Extract text from various file formats
    Supports: PDF, DOCX, DOC, PNG, JPG, JPEG, BMP, TIFF
    """
    file_extension = Path(file_path).suffix.lower()
    
    if file_extension == ".pdf":
        return extract_text_from_pdf(file_path)
    elif file_extension == ".docx":
        return extract_text_from_docx(file_path)
    elif file_extension == ".doc":
        return extract_text_from_doc(file_path)
    elif file_extension in [".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"]:
        return extract_text_from_image(file_path)
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")








