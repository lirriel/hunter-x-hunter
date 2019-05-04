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
    }).then(() => {
            if (compareId !== null) {
                saveSeriesCompare(pdf, filename, compareId)
                    .then(() => {
                        saveBehaveDiargamm(pdf, filename, behaveId)
                            .then(() => {
                                pdf.save(filename + '.pdf');
                                document.getElementById('pdf').innerHTML = '';
                            })
                    });
            } else {
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
    return html2canvas(document.getElementById(diagramId), {
        imageTimeout: 10000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
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

export function saveExperimentPdf(currentParams) {
    let filename = "experiment";
    let pdf = new jsPDF.jsPDF('portrait', 'mm', 'a4');
    pdfW = pdf.internal.pageSize.width;
    let pdfH = pdf.internal.pageSize.height;
    pdf.setFontSize(20);
    var y = 25;
    pdf.text(10, y, 'Predator-prey model. Parameter experiment');
    y += 10;
    pdf.setFontSize(10);
    pdf.text(10, y, pdf.splitTextToSize(getParamsText("", currentParams), MAX_WIDTH));
    y += 5;

    html2canvas(document.querySelector('#experiment-series'), {
        imageTimeout: 5000,
        useCORS: true
    }).then(canvas => {
        document.getElementById('pdf').innerHTML = '';
        document.getElementById('pdf').appendChild(canvas);
        let img = canvas.toDataURL('image/png');
        let xScale = (pdfW - 50) / canvas.clientWidth;
        y += 6;
        pdf.text(10, y, 'Population size changes is described below.');
        pdf.addImage(img, 'JPEG', 25, y, xScale * canvas.clientWidth, xScale * canvas.clientHeight);
        y += img.clientHeight + 20;
    }).then(() => {
        html2canvas(document.querySelector('#experiment-behave'), {
            imageTimeout: 5000,
            useCORS: true
        }).then(canvas => {
            document.getElementById('pdf').innerHTML = '';
            document.getElementById('pdf').appendChild(canvas);

            let img = canvas.toDataURL('image/png');
            let xScale = (pdfW - 50) / canvas.clientWidth;

            pdf.addPage();
            y = 10;

            pdf.text(10, y, 'Phase plane diagram.');
            pdf.addImage(img, 'JPEG', 25, y, xScale * canvas.clientWidth, xScale * canvas.clientHeight);
        }).then(() => {
            html2canvas(document.querySelector('#experiment-table'), {
                imageTimeout: 5000,
                useCORS: true
            }).then(canvas => {
                pdf.addPage();
                y = 10;

                document.getElementById('pdf').innerHTML = '';
                document.getElementById('pdf').appendChild(canvas);

                let img = canvas.toDataURL('image/png');
                let yScale = (pdfH - 50) / canvas.clientHeight;

                pdf.addImage(img, 'JPEG', 25, y, yScale * canvas.clientWidth, yScale * canvas.clientHeight);
            }).then(() => {
                pdf.save(filename + '.pdf');
                document.getElementById('pdf').innerHTML = '';
            });
        });
    });
}

export function getParamsText(modelType, currentParams) {
    let params = "";
    for (let key in currentParams) {
        params += key + ' = ' + currentParams[key] + ", ";
    }
    return "Considering a model of type \"" + modelType + "\" with parameters " + params + "."
}