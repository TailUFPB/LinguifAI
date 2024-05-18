export const ReactApexChartsDefaultOptions = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    xaxis: {
        labels: {
            style: {
                colors: "#ffffff",
            },
        },
        title: {
            text: "Epoch",
            style: {
                color: "#ffffff",
            },
        },
    },
    yaxis: {
        labels: {
            formatter: (value: number) => value.toFixed(4),
            style: {
                colors: "#ffffff",
            },
        },
        title: {
            text: "Loss",
            style: {
                color: "#ffffff",
            },
        },
    },
    tooltip: {
        theme: "dark",
    },
    grid: {
        borderColor: "#ffffff",
    },
    title: {
        text: "Loss vs Epochs",
        align: 'center' as 'center',
        style: {
            color: "#ffffff",
        },
    },
    legend: {
        labels: {
            colors: "#ffffff", // Muda a cor das legendas
        },
    },
};
