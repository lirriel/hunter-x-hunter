export let predatorPreyChartOptions = {
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
    colors: ["#4cffdd", "#FF1654", "#288c6c", "#ffa67f"],
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
        },
        {
            show: false,
            seriesName: 'Prey population'
        },
        {
            show: false,
            seriesName: 'Predator population'
        }
    ],
    xaxis: {
        title: {
            text: "Time",
            style: {
                color: "#883157",
                fontSize: "14px"
            }
        }
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

export let simpleChartOptions = {
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