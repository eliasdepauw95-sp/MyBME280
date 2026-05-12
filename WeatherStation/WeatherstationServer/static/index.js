const labels = JSON.parse(document.getElementById('labels-data').textContent);
const temperaturen = JSON.parse(document.getElementById('temperaturen-data').textContent);
const vochtigheidData = JSON.parse(document.getElementById('vochtigheid-data').textContent);
const drukData = JSON.parse(document.getElementById('druk-data').textContent);
const TEMP_UNIT_LABEL = "\u00B0C";

function getStats(values) {
    if (!values.length) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { min, max, avg };
}

function formatStats(values, suffix) {
    const stats = getStats(values);
    if (!stats) return "No data";
    return `Min: ${stats.min.toFixed(1)}${suffix} | Max: ${stats.max.toFixed(1)}${suffix} | Avg: ${stats.avg.toFixed(1)}${suffix}`;
}

function updateComfortStatus(tempValues, humValues) {
    const badge = document.getElementById("statusBadge");
    const lastTemp = tempValues[tempValues.length - 1];
    const lastHum = humValues[humValues.length - 1];

    if (lastTemp == null || lastHum == null) {
        badge.className = "badge badge-secondary";
        badge.textContent = "Insufficient data";
        return;
    }
    if (lastTemp >= 18 && lastTemp <= 25 && lastHum >= 35 && lastHum <= 60) {
        badge.className = "badge badge-success";
        badge.textContent = "Comfort";
    } else {
        badge.className = "badge badge-warning";
        badge.textContent = "Active";
    }
}

function createChart(canvasId, label, values, color) {
    return new Chart(document.getElementById(canvasId), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: values,
                    borderWidth: 2,
                    tension: 0.5,
                    borderColor: color,
                    pointRadius: 1.5,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: "index", intersect: false },
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false
                }
            },
            scales: { y: { beginAtZero: false } }
        }
    });
}

document.getElementById("tempStats").textContent = formatStats(temperaturen, TEMP_UNIT_LABEL);
document.getElementById("vochtStats").textContent = formatStats(vochtigheidData, "%");
document.getElementById("drukStats").textContent = formatStats(drukData, " hPa");
document.getElementById("countInfo").textContent = `${labels.length} measurements loaded`;

if (labels.length) {
    const latestLabel = labels[labels.length - 1];
    document.getElementById("lastUpdateInfo").textContent = `Latest data point: ${latestLabel}`;
} else {
    document.getElementById("lastUpdateInfo").textContent = "No data available";
}

updateComfortStatus(temperaturen, vochtigheidData);

if (labels.length) {
    createChart("tempChart", `Temperature ${TEMP_UNIT_LABEL}`, temperaturen, "red");
    createChart("vochtChart", "Humidity %", vochtigheidData, "blue");
    createChart("drukChart", "Pressure hPa", drukData, "yellow");
}

let refreshTimer = null;
const refreshSelect = document.getElementById("refreshSelect");

function applyRefreshInterval(seconds) {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
    if (seconds > 0) {
        refreshTimer = setInterval(() => window.location.reload(), seconds * 1000);
    }
}

refreshSelect.addEventListener("change", (event) => {
    applyRefreshInterval(Number(event.target.value));
});
applyRefreshInterval(Number(refreshSelect.value));

const backToTopBtn = document.getElementById("backToTopBtn");
window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
});
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", { hour12: false });
    const clock = document.getElementById("liveClock");
    if (clock) clock.textContent = time;
}

updateClock();
setInterval(updateClock, 1000);

const yearNow = document.getElementById("yearNow");
if (yearNow) yearNow.textContent = new Date().getFullYear();
