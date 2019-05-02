import html2canvas from 'html2canvas'
import * as jsPDF from "jspdf";

export function saveIdAsPdf(id, filename) {
    html2canvas(document.querySelector('#' + id), {
        imageTimeout: 5000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        let pdf = new jsPDF.jsPDF('portrait', 'mm', 'a4');
        pdf.addImage(img, 'JPEG', 5, 5, 200, 287);
        pdf.save(filename + '.pdf');
        document.getElementById('pdf').innerHTML = ''
    });
}