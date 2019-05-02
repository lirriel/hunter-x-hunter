import html2canvas from 'html2canvas'
import * as jsPDF from "jspdf";

let MAX_WIDTH = 180;

export function saveIdAsPdf(id, filename, modelType, currentParams) {
    let pdf = new jsPDF.jsPDF('portrait', 'mm', 'a4');
    let pdfW = pdf.internal.pageSize.width;
    pdf.setFontSize(20);
    let pdfH = pdf.internal.pageSize.height;
    var y = 25;
    pdf.text(35, y, 'Predator-prey model results');
    y += 10;
    pdf.setFontSize(12);
    pdf.text(10, y, pdf.splitTextToSize(getParamsText(modelType, currentParams), MAX_WIDTH));
    y += 10;

    html2canvas(document.querySelector('#' + id), {
        imageTimeout: 5000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        let xScale = (pdfW - 50) / canvas.clientWidth;
        pdf.addImage(img, 'JPEG', 25, y, xScale * canvas.clientWidth, xScale * canvas.clientHeight);
        y += img.clientHeight + 20;
    }).then(() => {
            html2canvas(document.querySelector('#seriesCompare'), {
                imageTimeout: 5000,
                useCORS: true
            }).then(canvas => {
                document.getElementById('pdf').appendChild(canvas);
                let img = canvas.toDataURL('image/png');
                pdf.addPage();
                y = 10;
                let xScale = (pdfW - 50) / canvas.clientWidth;
                pdf.text(10, y, pdf.splitTextToSize(
                    'Comparison with other input parameters for the model',
                    MAX_WIDTH)
                );
                pdf.addImage(img, 'JPEG', 25, y + 10,
                    xScale * canvas.clientWidth, xScale * canvas.clientHeight);
            }).then(() => {
                pdf.save(filename + '.pdf');
                document.getElementById('pdf').innerHTML = '';
            });
        }
    );
}

export function getParamsText(modelType, currentParams) {
    let params = "";
    for (let key in currentParams) {
        params += key + ' = ' + currentParams[key] + ", ";
    }
    return "Considering a model of type \"" + modelType + "\" with parameters " + params + "."
}