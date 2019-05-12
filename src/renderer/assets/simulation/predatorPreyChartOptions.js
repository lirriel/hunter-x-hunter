export let predatorPreyChartOptions =  {
    title: {
        text: 'Predator-prey population size'
    },
    chart: {
        zoom: {
            enabled: true
        },
    },
    grid: {
        clipMarkers: false
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        x: {},
        y: {}
    },
    colors: ["#4cffdd", "#FF1654", "#fffdfe","#d17430"],
    yaxis: [
        {
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: "#FF1654"
            },
            labels: {
                style: {
                    color: "#FF1654"
                },
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                trim: true,
                formatter: function (value) {
                    return value.toFixed(2)
                }
            },
            title: {
                text: "Prey population"
            }
        },
        {
            opposite: true,
            axisTicks: {
                show: true
            },
            axisBorder: {
                show: true,
                color: "#247BA0"
            },
            labels: {
                style: {
                    color: "#247BA0"
                },
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                trim: true,
                formatter: function (value) {
                    return value.toFixed(2);
                }
            },
            title: {
                text: "Predator population"
            }
        }
    ],
    legend: {
        horizontalAlign: "left",
        offsetX: 10
    },
    stroke: {
        curve: "smooth",
        width: 2
    },
};

export let simpleChartOptions =  {
    chart: {
        zoom: {
            enabled: true
        },
    },
    grid: {
        clipMarkers: false
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        x: {},
        y: {}
    },
    legend: {
        horizontalAlign: "left",
        offsetX: 10
    },
    stroke: {
        curve: "straight",
        width: 2
    },
};