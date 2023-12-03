fetch('/admin/getStats')
.then(response=>{
    if(response.ok) return response.json()
    throw { status: response.status, data: response.json() };
})
.then(data=>{
    if(data){
    showTransactionStats(data.transactions)
    }
})
.catch(handleError)


function showTransactionStats(stats){
  if(!document.getElementById('ot')) return;
    document.getElementById('ot').innerHTML='\u20B9'+stats.totaltransactions[1]
    document.getElementById('cod').innerHTML='\u20B9'+stats.totaltransactions[2]
    document.getElementById('wt').innerHTML='\u20B9'+stats.totaltransactions[0]
    
    const totalSum = stats.totaltransactions.reduce((sum, value) => sum + value, 0);

    // Convert each element to its percentage
    const percentages = stats.totaltransactions.map(value => (value / totalSum) * 100);

    if ($("#transaction-history").length) {
      var areaData = {
        labels: stats.labels,
        datasets: [{
            data: percentages,
            backgroundColor: [
              "#f0e111","#f22307","#22f545"
            ]
          }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
              borderWidth: 0
          }
        },      
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionhistoryChartPlugins = {
        beforeDraw: function(chart) {
          var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;
      
          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#000";
      
          var text = `\u20B9 ${totalSum}`, 
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2.4;
      
          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "Total", 
              textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
              textsY = height / 1.7;
      
          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionhistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");
      var transactionhistoryChart = new Chart(transactionhistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionhistoryChartPlugins
      });
    }
}


if(document.getElementById('listedUsers')){
    fetch('/admin/getBasicInfos')
    .then(response=>{
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        console.log(data)
        if(data){
            document.getElementById('listedUsers').innerHTML=data.userCount
            document.getElementById('monthlyOrders').innerHTML=data.totalOrdersThisMonth
        }
    })
    .catch(handleError)
  }
