from fpdf import FPDF
import os

def save_pdf(transcript, filename):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, transcript)
    
    os.makedirs("static/transcripts", exist_ok=True)
    output_path = f"static/transcripts/{filename}.pdf"
    pdf.output(output_path)
    return output_path
