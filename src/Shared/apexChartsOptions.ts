export const ReactApexChartsDefaultOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
    },
    xaxis: {
        labels: {
            style: {
                colors: "#000",
            },
        },
        title: {
            text: "Epoch",
            style: {
                color: "#000",
            },
        },
    },
    yaxis: {
        labels: {
            formatter: (value: number) => value.toFixed(4),
            style: {
                colors: "#000",
            },
        },
        title: {
            text: "Loss",
            style: {
                color: "#000",
            },
        },
    },
    tooltip: {
        theme: "dark",
    },
    grid: {
        borderColor: "#777",
        strokeDashArray: 1,
    },
    title: {
        text: "Loss vs Epochs",
        align: 'center' as 'center',
        style: {
            color: "#000",
        },
    },
    legend: {
        labels: {
            colors: "#000", // Muda a cor das legendas
        },
    },
};
