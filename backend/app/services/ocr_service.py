import easyocr
reader = easyocr.Reader(['en'])

def extract_text_from_image(image_file) -> str:
    image_file.seek(0) 
    img_bytes = image_file.read()
    result = reader.readtext(img_bytes, detail=0)
    text = " ".join(result)
    return text.strip()
