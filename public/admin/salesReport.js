

function downloadTableInExcel() {
  // Get the table data as an array of objects
  const tableData = [];
  const rows = document.querySelectorAll('#salesTableBody tr');
  rows.forEach(row => {
      const rowData = [];
      row.querySelectorAll('td').forEach(cell => {
          rowData.push(cell.textContent);
      });
      tableData.push(rowData);
  });

  // Create a worksheet
  const ws = XLSX.utils.aoa_to_sheet([['#', 'Order Number', 'Order Date', 'Delivery Date', 'Customer', 'Customer ID', 'Product', 'Product ID', 'Sales Status', 'Payment Method', 'Payment Status', 'Order Status', 'Price', 'Quantity', 'Total Price'], ...tableData]);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Table');

  // Save the workbook
  XLSX.writeFile(wb, 'sales_table.xlsx');
}




function getSalesReport(timePeriod){
   
    fetch(`/admin/getSalesReport?timePeriod=${timePeriod}`)
    .then(response=>{
      if(response.status==401){
        window.location.href='/admin'
        return
      }
        if(response.ok) return response.json()
        throw { status: response.status, data: response.json() };
    })
    .then(data=>{
        let labeles=[`${timePeriod}1`,`${timePeriod}2`,`${timePeriod}3`,`${timePeriod}4`,`${timePeriod}5`]
        areaChart(labeles,data.statistics)
        barChart(data.categories,data.categoryqty)
        setAverageOrderValueAndCounts(data.currentSales,data.lastSales)
        showSalesData('all','all','all')
        
    })
    .catch(handleError)
}

let areaChartInstance

function areaChart(labels, data) {
    var areaData = {
      labels: labels,
      datasets: [{
        label: 'Total Sales',
        data: data,
        backgroundColor:'#CDF5FD', 

        borderColor: '#00A9FF',

        borderWidth: 1,
        fill: true,
      }]
    };
  
    var areaOptions = {
      plugins: {
        filler: {
          propagate: true
        }
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: "rgba(204, 204, 204, 0.1)"
          }
        }],
        xAxes: [{
          gridLines: {
            color: "rgba(204, 204, 204, 0.1)"
          }
        }]
      }
    };
  
    if ($("#areaChart").length) {
      var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
      if(areaChartInstance){
        areaChartInstance.destroy()
      }
       areaChartInstance = new Chart(areaChartCanvas, {
        type: 'line',
        data: areaData,
        options: areaOptions
      });
    }
  }
  

  function setAverageOrderValueAndCounts(current,previous){
    

    setTotalSales(current.totalOrderAmount,previous.totalOrderAmount)
    setTotalOrder(current.totalOrders,previous.totalOrders)
    setAverageOrder(current.averageOrderValue,previous.averageOrderValue)

  }

  function setTotalSales(current,previous){

    // Extract AOV values from the results
    const currentTotalSales = current ? current : 0;
    const previousTotalSales = previous ? previous : 0;
    let potentialGrowth 
    if(previousTotalSales>0){
    // Calculate potential growth
    potentialGrowth= ((currentTotalSales - previousTotalSales) / previousTotalSales) * 100;
    }else{
        potentialGrowth='Infinity';
    }
    document.getElementById('totalSales').innerHTML='\u20B9'+`${currentTotalSales}`
    if(potentialGrowth.toFixed(2)>0){
        const PG=document.getElementById('totalSalesPG')
        PG.innerHTML=`+${potentialGrowth.toFixed(2)}%`
        PG.classList.remove('text-danger')
        PG.classList.add('text-success')

    document.getElementById('totalSalesMarking').innerHTML=`<div class="icon icon-box-success ">
                                                            <span class="mdi mdi-arrow-top-right icon-item"></span>
                                                            </div>`
    }else{
        const PG=document.getElementById('totalSalesPG')
        PG.innerHTML=`${potentialGrowth.toFixed(2)}%`
        PG.classList.remove('text-success')
        PG.classList.add('text-danger')
        document.getElementById('totalSalesMarking').innerHTML=`<div class="icon icon-box-danger ">
                                                                <span class="mdi mdi-arrow-bottom-left icon-item"></span>
                                                                </div>`
    }
  }

  function setTotalOrder(current,previous){

    // Extract AOV values from the results
    const currentTotalOrder = current ? current : 0;
    const previousTotalOrder = previous ? previous : 0;
    console.log(currentTotalOrder,previousTotalOrder)
    let potentialGrowth;
    if(previousTotalOrder>0){
    // Calculate potential growth
     potentialGrowth = ((currentTotalOrder - previousTotalOrder) / previousTotalOrder) * 100;
    }else{
      potentialGrowth='Infinity';
    }
    document.getElementById('totalOrder').innerHTML=currentTotalOrder;

    if(potentialGrowth.toFixed(2)>0){
        const PG=document.getElementById('totalOrderPG')
        PG.innerHTML=`+${potentialGrowth.toFixed(2)}%`
        PG.classList.remove('text-danger')
        PG.classList.add('text-success')

    document.getElementById('totalOrderMarking').innerHTML=`<div class="icon icon-box-success ">
                                                            <span class="mdi mdi-arrow-top-right icon-item"></span>
                                                            </div>`
    }else{
        const PG=document.getElementById('totalOrderPG')
        PG.innerHTML=`${potentialGrowth.toFixed(2)}%`
        PG.classList.remove('text-success')
        PG.classList.add('text-danger')
        document.getElementById('totalOrderMarking').innerHTML=`<div class="icon icon-box-danger ">
                                                                <span class="mdi mdi-arrow-bottom-left icon-item"></span>
                                                                </div>`
    }
  }

  function setAverageOrder(current,previous){

    // Extract AOV values from the results
    const currentAverageOrder = current ? current : 0;
    const previousAverageOrder = previous ? previous : 0;
    let potentialGrowth
    if(previousAverageOrder>0){
    // Calculate potential growth
     potentialGrowth = ((currentAverageOrder - previousAverageOrder) / previousAverageOrder) * 100;
    }else{
      potentialGrowth='Infinity';
    }
    document.getElementById('averageOrder').innerHTML=`\u20B9${currentAverageOrder.toFixed(2)}`;
   
    if(potentialGrowth.toFixed(2)>0){
        const PG=document.getElementById('averageOrderPG')
        PG.innerHTML=`+${potentialGrowth.toFixed(2)}%`
        PG.classList.remove('text-danger')
        PG.classList.add('text-success')

    document.getElementById('averageOrderMarking').innerHTML=`<div class="icon icon-box-success ">
                                                            <span class="mdi mdi-arrow-top-right icon-item"></span>
                                                            </div>`
    }else{
        const PG=document.getElementById('averageOrderPG')
        PG.innerHTML=`${potentialGrowth.toFixed(2)}%`
        PG.classList.remove('text-success')
        PG.classList.add('text-danger')
        document.getElementById('averageOrderMarking').innerHTML=`<div class="icon icon-box-danger ">
                                                                <span class="mdi mdi-arrow-bottom-left icon-item"></span>
                                                                </div>`
    }
  }

let barChartInstance;
function barChart(labels,data){

    var data = {
      labels: labels,
      datasets: [{
        label: '# of Votes',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        fill: false
      }]
    };


    var options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: "rgba(204, 204, 204,0.1)"
          }
        }],
        xAxes: [{
          gridLines: {
            color: "rgba(204, 204, 204,0.1)"
          }
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
    };
      // Get context with jQuery - using jQuery's .get() method.
  if ($("#barChart").length) {
    var barChartCanvas = $("#barChart").get(0).getContext("2d");

  
    if(barChartInstance){
      barChartInstance.destroy();
    }
    
    // This will get the first returned node in the jQuery collection.
     barChartInstance = new Chart(barChartCanvas, {
      type: 'bar',
      data: data,
      options: options
    });
   
  }
}

let selectedTime='',selectedPaymentStatus='all',selectedOrderStatus='all'
function changeSalesDataTimePeriod(time){

        if(selectedTime !== time){
          selectedTime=time
        showSalesData(selectedTime,selectedPaymentStatus,selectedOrderStatus)
        }
}



function filterBySalesPaymentStatus(status){
      if(selectedPaymentStatus !== status){
        selectedPaymentStatus=status
        showSalesData(selectedTime,selectedPaymentStatus,selectedOrderStatus)
      }
}

function filterBySalesOrderStatus(status){
  
  if(selectedOrderStatus !== status){
    selectedOrderStatus=status
    showSalesData(selectedTime,selectedPaymentStatus,selectedOrderStatus)
  }
}

function showSalesData(time,paymentStatus,orderStatus){
  
  fetch(`/admin/getSalesData?timePeriod=${time}&paymentStatus=${paymentStatus}&orderStatus=${orderStatus}`)
  .then(response=>{
    if(response.status==401){
      window.location.href='/admin'
      return
    }
    if(response.ok) return response.json()
    throw { status: response.status, data: response.json() };
  })
  .then(data=>{
    
    setSalesData(data.sales)
  })
  .catch(handleError)
}

function setSalesData(data){
  let i=1

  if(data.length>0) document.getElementById('salesTableBody').innerHTML=''
    for(let item of data){
      const salesStatus=item.paymentStatus=='received'?'Credit':'Debit'
      const row=document.createElement('tr')
      row.innerHTML=`
      <td>${i++}</td>
      <td>${item.orderNumber}</td>
      <td>${item.orderDate}</td>
      <td>${item.deliveryDate}</td>
      <td>${item.customer}</td>
      <td>${item.customerId}</td>
      <td>${item.product}</td>
      <td>${item.productId}</td>
      <td>${salesStatus}</td>
      <td>${item.paymentMethod}</td>
      <td>${item.paymentStatus}</td>
      <td>${item.orderStatus}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td>${item.totalPrice}</td>`


      
      document.getElementById('salesTableBody').appendChild(row)
    }
}




function setActive(elem){
  document.querySelector('.active').classList.remove('active')
  elem.classList.add('active')

}

function setChoose(elem){
  document.querySelector('.choose').classList.remove('choose')
  elem.classList.add('choose')
}

function loadSalesReport(){
  fetch('/admin/salesReport')
  .then(response=>{
    if(response.status==401){
      window.location.href='/admin'
      return
    }
      if(response.ok) return response.text()
      throw { status: response.status, data: response.json() };
  })
  .then(html=>{
      pageContent.innerHTML=html
      getSalesReport('week')
      changeSalesDataTimePeriod('week')
  })
  .catch(handleError)
}