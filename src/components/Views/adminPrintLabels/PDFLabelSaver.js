import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { PrintLabels } from './PrintLabels';

const PDFSaver = () => {
  const contentRef = useRef(null);

  const saveAsPDF = () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const opt = {
      margin: 0,
      filename: 'webpage.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }//portrait, landscape
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <button className='sticker-PDF-button' onClick={saveAsPDF}>PDF</button>
      <div ref={contentRef}>
        <PrintLabels/>
      </div>
    </div>
  );
};

export default PDFSaver;
