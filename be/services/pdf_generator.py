from fpdf import FPDF
import os

def save_pdf(transcript, base_name):
    """
    Generate PDF from transcript text with UTF-8 support
    """
    pdf = FPDF()
    pdf.add_page()
    
    # Use a font that supports UTF-8 encoding
    # Using helvetica which works better with special characters
    pdf.set_font("helvetica", size=12)
    
    # Add title
    pdf.set_font("helvetica", "B", size=14)
    pdf.cell(0, 10, "Extracted Text", ln=True, align="L")
    
    # Reset to normal font for content
    pdf.set_font("helvetica", size=11)
    
    # Handle UTF-8 text properly by encoding it
    try:
        # Encode to UTF-8 and decode back to handle special characters
        clean_text = transcript.encode('utf-8', errors='replace').decode('utf-8')
    except Exception as e:
        print(f"Error encoding text: {e}")
        clean_text = transcript
    
    # Add the text content
    pdf.multi_cell(0, 5, clean_text)
    
    # Create output directory if it doesn't exist
    os.makedirs("static/transcripts", exist_ok=True)
    output_path = f"static/transcripts/{base_name}.pdf"
    
    try:
        pdf.output(output_path)
    except UnicodeEncodeError:
        # If still encountering issues, try with latin-1 encoding
        # This will replace problematic characters with ?
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("helvetica", size=12)
        pdf.cell(0, 10, "Extracted Text", ln=True)
        
        # Remove non-latin-1 characters
        cleaned = ''.join(c if ord(c) < 256 else '?' for c in transcript)
        pdf.multi_cell(0, 5, cleaned)
        pdf.output(output_path)
    
    return output_path