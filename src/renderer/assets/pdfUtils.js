import html2canvas from 'html2canvas'
import * as jsPDF from "jspdf";

let MAX_WIDTH = 180;
let pdfW = 10;

export function saveIdAsPdf(id, filename, modelType, currentParams, compareId, behaveId, bifurId) {
    let pdf = new jsPDF.jsPDF('portrait', 'mm', 'a4');
    pdfW = pdf.internal.pageSize.width;
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
        document.getElementById('pdf').innerHTML = '';
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        let xScale = (pdfW - 50) / canvas.clientWidth;
        pdf.addImage(img, 'JPEG', 25, y, xScale * canvas.clientWidth, xScale * canvas.clientHeight);
        y += img.clientHeight + 20;
        console.log('1')
    }).then(() => {
            if (compareId !== null) {
                console.log('2')
                saveSeriesCompare(pdf, filename, compareId)
                    .then(() => {
                        console.log('3')
                        saveBehaveDiargamm(pdf, filename, behaveId)
                            .then(() => {
                                console.log('bif')
                                pdf.save(filename + '.pdf');
                                document.getElementById('pdf').innerHTML = '';
                            })
                    });
            } else {
                console.log('2.1')
                saveBehaveDiargamm(pdf, filename, behaveId)
                    .then(() => {
                        pdf.save(filename + '.pdf');
                        document.getElementById('pdf').innerHTML = '';
                    })
            }
        }
    );
}

function saveSeriesCompare(pdf, filename, compareId) {
    return html2canvas(document.querySelector('#' + compareId), {
        imageTimeout: 5000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').innerHTML = '';
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        pdf.addPage();
        let y = 10;
        let xScale = (pdfW - 50) / canvas.clientWidth;
        pdf.text(10, y, pdf.splitTextToSize(
            'Comparison with other input parameters for the model',
            MAX_WIDTH)
        );
        pdf.addImage(img, 'JPEG', 25, y + 10,
            xScale * canvas.clientWidth, xScale * canvas.clientHeight);
    });
}

function saveBehaveDiargamm(pdf, filename, diagramId) {
    return html2canvas(document.querySelector('#' + diagramId), {
        imageTimeout: 5000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').innerHTML = '';
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        pdf.addPage();
        let y = 30;
        let xScale = (pdfW - 50) / canvas.clientWidth;
        pdf.text(10, y, pdf.splitTextToSize("Phase plane diagram, where x axis describes prey size and y axis - predator size", MAX_WIDTH));
        pdf.addImage(img, 'JPEG', 25, y + 10,
            xScale * canvas.clientWidth, xScale * canvas.clientHeight);
    })
}

function saveBifurcationDiargamm(pdf, filename, diagramId) {
    console.log("quer")
    console.log(document.getElementById(diagramId))
    return html2canvas(document.getElementById(diagramId), {
        imageTimeout: 10000,
        useCORS: true
    }).then(canvas => {
        console.log('canvas ')
        console.log(canvas)
        document.getElementById('pdf').innerHTML = '';
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        console.log('img')
        console.log(img)
        console.log(diagramId)
        pdf.addPage();
        let y = 30;
        let xScale = (pdfW - 50) / canvas.clientWidth;
        pdf.text(10, y, pdf.splitTextToSize(
            'Bifurcation diargram',
            MAX_WIDTH)
        );
        pdf.addImage(img, 'JPEG', 25, y + 10,
            xScale * canvas.clientWidth, xScale * canvas.clientHeight);
    })
}

export function saveExperimentPdf(id, currentParams) {
    let filename = "experiment";
    let pdf = new jsPDF.jsPDF('portrait', 'mm', 'a4');
    pdfW = pdf.internal.pageSize.width;
    pdf.setFontSize(20);
    var y = 25;
    pdf.text(35, y, 'Predator-prey model. Parameter experiment');
    y += 10;
    pdf.setFontSize(12);
    pdf.text(10, y, pdf.splitTextToSize(getParamsText("", currentParams), MAX_WIDTH));
    y += 10;

    html2canvas(document.querySelector('#' + id), {
        imageTimeout: 5000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').innerHTML = '';
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        let xScale = (pdfW - 50) / canvas.clientWidth;
        pdf.addImage(img, 'JPEG', 25, y, xScale * canvas.clientWidth, xScale * canvas.clientHeight);
        y += img.clientHeight + 20;
        console.log('1')
    }).then(() => {
        pdf.save(filename + '.pdf');
        document.getElementById('pdf').innerHTML = '';
    });
}

export function getParamsText(modelType, currentParams) {
    let params = "";
    for (let key in currentParams) {
        params += key + ' = ' + currentParams[key] + ", ";
    }
    return "Considering a model of type \"" + modelType + "\" with parameters " + params + "."
}