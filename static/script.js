   let trendChart;

   function login() {
     if (
       document.getElementById("username").value === "admin" &&
       document.getElementById("password").value === "admin123"
     ) {
       document.getElementById("loginPage").style.display = "none";
       document.getElementById("dashboard").style.display = "block";

       loadCharts();
       loadMap();
       simulateData();
     } else {
       alert("Invalid login");
     }
   }

   function showPage(page) {
     document.querySelectorAll(".page").forEach(p => p.style.display = "none");
     document.getElementById(page).style.display = "block";
   }

   /* CHARTS */
   function loadCharts() {

     new Chart(document.getElementById("riskChart"), {
       type: 'bar',
       data: {
         labels: ['High','Medium','Low'],
         datasets: [{
           data: [6,10,20]
         }]
       }
     });

     trendChart = new Chart(document.getElementById("trendChart"), {
       type: 'line',
       data: {
         labels: ["1","2","3","4","5"],
         datasets: [{
           label: "Threat Trend",
           data: [2,5,3,6,4]
         }]
       }
     });

     new Chart(document.getElementById("cryptoChart"), {
       type: 'pie',
       data: {
         labels: ['Strong','Weak'],
         datasets: [{
           data: [20,5]
         }]
       }
     });

     new Chart(document.getElementById("ratingChart"), {
       type: 'doughnut',
       data: {
         labels: ['Score','Remaining'],
         datasets: [{
           data: [78,22]
         }]
       }
     });
   }

   /* LIVE DATA */
   function simulateData() {
     setInterval(() => {
       let val = Math.floor(Math.random()*10);

       trendChart.data.datasets[0].data.push(val);
       trendChart.data.labels.push("");

       if (trendChart.data.labels.length > 10) {
         trendChart.data.labels.shift();
         trendChart.data.datasets[0].data.shift();
       }

       trendChart.update();

       document.getElementById("threats").innerText = Math.floor(Math.random()*20);
       document.getElementById("high").innerText = Math.floor(Math.random()*10);

     }, 2000);
   }

   /* MAP */
   function loadMap() {
     const map = L.map('map').setView([13.0827, 80.2707], 5);

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

     L.marker([13.0827, 80.2707]).addTo(map).bindPopup("Primary Node");
     L.marker([28.7041, 77.1025]).addTo(map).bindPopup("Secondary Node");
   }

   /* CSV */
   function downloadCSV() {
     let csv = "Asset,Risk\nweb-app,High\napi,Medium";

     const blob = new Blob([csv], { type: "text/csv" });
     const link = document.createElement("a");
     link.href = URL.createObjectURL(blob);
     link.download = "report.csv";
     link.click();
   }

   document.addEventListener("DOMContentLoaded", () => {
     showPage("home");
   });