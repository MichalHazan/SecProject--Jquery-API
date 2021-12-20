$(() => {

    /* הגדרת מערך שיכיל את כל המטבעות שנבחרו */
    let selectedCoinsArr = []
    let selectedCoinsSymbol = []
    /* הגדרת מערך שיכיל את כל המטבעות שהוסרו בחלון הקופץ */
    let RemovedCoinsArr = [];
    let AllCoins;
    // -----------אלמנטים לדוחות----------
    let currectCurrencyArr1 = [];
    let currectCurrencyArr2 = [];
    let currectCurrencyArr3 = [];
    let currectCurrencyArr4 = [];
    let currectCurrencyArr5 = [];
    let realTimeCoins = [];
    let interval;

    // ---------------------------------------------------------------------

    // ----גישה לAPI ------
    $('#bodyDiv').html($progresbar)
    move()
    $.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=100", (coins) => {
        $('#bodyDiv').html("")
        if (localStorage.getItem("AllCoins")) {
            AllCoins = JSON.parse(localStorage.getItem("AllCoins"))
        } else {
            localStorage.setItem("AllCoins", JSON.stringify(coins))
            AllCoins = JSON.parse(localStorage.getItem("AllCoins"))
        }

        for (const coin of AllCoins) {
            DrawCard(coin)
        }
    })

    // ----לחיצה על דף המטבעות---------
    $(".CoinsPage").click(() => {
        currectCurrencyArr1 = [];
        currectCurrencyArr2 = [];
        currectCurrencyArr3 = [];
        currectCurrencyArr4 = [];
        currectCurrencyArr5 = [];
        
        clearInterval(interval);

        $('#bodyDiv').html($progresbar)
        move()
        $('#bodyDiv').html("")

        AllCoins = JSON.parse(localStorage.getItem("AllCoins"))
        for (const coin of AllCoins) {
            DrawCard(coin)
        }
    })
    // ----לחיצה על דף דוחות---------
    $(".LiveReportsPage").click(() => {
        selectedCoinsSymbol = []
        interval = 0
        AllCoins = JSON.parse(localStorage.getItem("AllCoins"))
        for (const coin of AllCoins) {
            if (selectedCoinsArr.includes(coin.id)) {
                selectedCoinsSymbol.push(coin.symbol)
                console.log(coin.id + " his s : " + coin.symbol);
            }
        }


        if (selectedCoinsSymbol.length === 0) {
            alert('Select 1-5 coins to see the report');

        } else {
            interval = setInterval(() => {
                getGraphData();
            }, 2000);
            $('#bodyDiv').html($progresbar)
            move()

        }

    })
    function getGraphData() {
        $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${selectedCoinsSymbol[0]},${selectedCoinsSymbol[1]},${selectedCoinsSymbol[2]},${selectedCoinsSymbol[3]},${selectedCoinsSymbol[4]}&tsyms=USD`, (data) => {


            if (data.Response === "Error") {
                $('#bodyDiv').html(`<div class="noneselectedmsg"> <h2>Oops.. No data on selected currencies</h2> </div>`);
            }

            else {

                $('#bodyDiv').html($Report);
                let currectDate = new Date();
                let counter = 1;
                realTimeCoins = [];

                for (let key in data) {
                    switch (counter) {
                        case 1:
                            currectCurrencyArr1.push({ x: currectDate, y: data[key].USD });
                            realTimeCoins.push(key);
                            break;
                        case 2:
                            currectCurrencyArr2.push({ x: currectDate, y: data[key].USD });
                            realTimeCoins.push(key);
                            break;
                        case 3:
                            currectCurrencyArr3.push({ x: currectDate, y: data[key].USD });
                            realTimeCoins.push(key);
                            break;
                        case 4:
                            currectCurrencyArr4.push({ x: currectDate, y: data[key].USD });
                            realTimeCoins.push(key);
                            break;
                        case 5:
                            currectCurrencyArr5.push({ x: currectDate, y: data[key].USD });
                            realTimeCoins.push(key);
                            break;
                    }
                    counter++;
                }
                showGraphOnPage();
            }
        })
    }
    function showGraphOnPage() {

        let chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: `Selected Coins: ${selectedCoinsSymbol} to USD`
            },

            subtitles: [{
                text: "Hover the charts to see currency rate"
            }],
            axisX: {
                valueFormatString: "HH:mm:ss"
            },

            axisY: {
                title: "Coin Value",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: false
            },

            axisY2: {
                title: "",
                titleFontColor: "#C0504E",
                lineColor: "#C0504E",
                labelFontColor: "#C0504E",
                tickColor: "#C0504E",
                includeZero: false
            },
            toolTip: {
                shared: true
            },

            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },

            data: [
                {
                    type: "line",
                    name: realTimeCoins[0],
                    showInLegend: true,
                    xValueFormatString: "HH:mm",
                    dataPoints: currectCurrencyArr1

                },

                {
                    type: "line",
                    name: realTimeCoins[1],
                    showInLegend: true,
                    xValueFormatString: "HH:mm",
                    dataPoints: currectCurrencyArr2

                },

                {

                    type: "line",
                    name: realTimeCoins[2],
                    showInLegend: true,
                    xValueFormatString: "HH:mm",
                    dataPoints: currectCurrencyArr3

                },

                {

                    type: "line",
                    name: realTimeCoins[3],
                    showInLegend: true,
                    xValueFormatString: "HH:mm",
                    dataPoints: currectCurrencyArr4

                },

                {

                    type: "line",
                    name: realTimeCoins[4],
                    showInLegend: true,
                    xValueFormatString: "HH:mm",
                    dataPoints: currectCurrencyArr5

                }
            ]
        }
        );

        chart.render();

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    }

    // ----לחיצה על דף אודות---------
    $(".AboutPage").click(() => {
        clearInterval(interval);
        $('#bodyDiv').html(`
        <div class="about">
                <p>Hey I am Michal Hazan, i'm 22 y.o . I love coding 😎
                <br>
                I am doing my best here, so I really hope for success.
                <br>
                I work hard to be in the place i am
                <br>
                <br>
                <span>This project includes: HTML, CSS, JavaScript, AJAX Api, JQuery , Canvas JS , Bootstrap and more.</span>
                <br>
                full stack developer
                </p>
                <img src="pics/me.jpg" alt="me">
                
            </div>
        `)
    })


    // ------פונקציה שיוצרת כרטיס לכל מטבע------------------
    function DrawCard(coin) {

        $('#bodyDiv').append(`
        <div class="card">
        <div class="card-body" id="card${coin.id}">
        <label class="switch">
        <input type="checkbox" id="${coin.id}-id">
        <span class="slider round"></span>
        </label>
        <h5 class="card-title coinSymbol">${coin.symbol}</h5>
        <p class="card-text coinId">${coin.id}</p>
        <a class="btn btn-primary" id=Btn${coin.id}>More info</a>
        <div class="MoreInfoDiv" id=DivInfo${coin.id}>
        </div>
        
        </div>
        
        </div>
        `)
        if (selectedCoinsArr.length > 0) {
            selectedCoinsArr.forEach(selectedCoin => {
                if (selectedCoin == coin.id) {
                    $(`#${selectedCoin}-id`).prop("checked", true)

                }
            });
        }

        // ------מידע נוסף לכל מטבע------------------

        $(`#Btn${coin.id}`).click(() => {
            $(`#DivInfo${coin.id}`).slideToggle("slow");
            getMoreInfoBtn(coin.id)


        })
        // -------שמירת מטבע---------
        $(`#${coin.id}-id`).click((e) => {
            // e.preventDefault()
            toggleButtons(coin)
        })
        // ----------------------------------------------------
    }
    // ------------------------------שמירת מטבע-------------------------------------------
    /* פונקציה שמזהה לחיצה על כפתור- לאחר שהתוכן שבחלון הקופץ הוצג */
    const removeCoins = () => {

        selectedCoinsArr.forEach(selectedCoin => {
            // console.log(selectedCoin);
            $(`#${selectedCoin}-id1`).on('click', () => {
                if ($(`#${selectedCoin}-id1`).prop("checked")) {
                    let removeItem1 = selectedCoin
                    RemovedCoinsArr.splice($.inArray(removeItem1, RemovedCoinsArr), 1);
                    // console.log(RemovedCoinsArr);
                } else {
                    RemovedCoinsArr.push(selectedCoin);
                    // console.log(RemovedCoinsArr);

                }

            })
        })
    }

    /* פונקציה ללחיצה על כפתור הבחירה */
    let toggleButtons = (coinFromTheFor) => {

        /* בלחיצה על כפתור בחירה */
        console.log(selectedCoinsArr);
        if ($(`#${coinFromTheFor.id}-id`).prop('checked')) {
            if (selectedCoinsArr.length >= 5) {
                Swal.fire({
                    title: 'You can pick only 5 coins!',
                    icon: 'warning',
                    html: popWindowContent(coinFromTheFor),
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) { // click ok

                        if (RemovedCoinsArr.length > 0) {

                            for (let removeCoin of RemovedCoinsArr) {
                                $(`#${removeCoin}-id`).prop('checked', false);
                                let removeItem = removeCoin
                                selectedCoinsArr.splice($.inArray(removeItem, selectedCoinsArr), 1);
                                console.log(selectedCoinsArr);
                            };

                            console.log("Remove : " + RemovedCoinsArr);
                            $(`#${coinFromTheFor.id}-id`).prop('checked')

                            console.log(selectedCoinsArr);
                        } else {
                            console.log("לא נבחר");
                            $(`#${coinFromTheFor.id}-id`).prop('checked', false)


                        }




                    } else if (result.dismiss === Swal.DismissReason.cancel) { // click cancel

                        $(`#${coinFromTheFor.id}-id`).prop('checked', false)
                        selectedCoinsArr.pop()
                        return false;
                    }
                    RemovedCoinsArr = []

                });

            };
            console.log("Choosen!");
            selectedCoinsArr.push(coinFromTheFor.id);

            removeCoins();

        } else {
            console.log("Not choosen");
            let removeItem = coinFromTheFor.id
            selectedCoinsArr.splice($.inArray(removeItem, selectedCoinsArr), 1);
            console.log(selectedCoinsArr);
        }
        localStorage.setItem("selectedCoinsArr", selectedCoinsArr)

    };

    /* פונקציית תצוגת החלון הקופץ בבחירה של מעל מ5 כפתורים */
    const popWindowContent = () => {
        let toggle = `<ul class="toggledCoins">`
        selectedCoinsArr.forEach((selectedCoins) => {
            toggle += `
          <li>
              <span class="coinsToggle"> ${selectedCoins} </span>
              <div class="on-off-btn">
                 <label class="switch button-toggle" >
                    <input type="checkbox" checked="checked" id="${selectedCoins}-id1">
                    <span class="slider round" ></span>
                 </label>   
               </div>
    
          </li>`
        })

        toggle += `</ul>`;
        return toggle;

    };
    // ------------------------------------------------------------------------------------------------------
    // -------------------------------------מידע נוסף------------------------------
    function getMoreInfoBtn(coinId) {
        $(`#DivInfo${coinId}`).html($progresbar)
        move()
        let currectTime = Date.now();
        let savedToLocalCoin = JSON.parse(localStorage.getItem(`${coinId}`));
        if (savedToLocalCoin != null && (currectTime - savedToLocalCoin.time) < 120000) {
            console.log("מידע מהלוקל");

            $(`#DivInfo${coinId}`).html(`
                  <img src=${savedToLocalCoin.image.small} alt="${coinId}">
                  <p class="USD">${savedToLocalCoin.market_data.current_price.usd} $</p>
                  <p class="EUR">${savedToLocalCoin.market_data.current_price.eur} €</p>
                  <p class="ILS">${savedToLocalCoin.market_data.current_price.ils} ₪</p>
                
                  `)
        } else {
            console.log("לא נמצא בלוקל או שעברו 2 דק");
            $.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, (data) => {
                $(`#DivInfo${coinId}`).html(`
                            <img src=${data.image.small} alt="${coinId}">
                            <p class="USD">${data.market_data.current_price.usd} $</p>
                            <p class="EUR">${data.market_data.current_price.eur} €</p>
                            <p class="ILS">${data.market_data.current_price.ils} ₪</p>
                            `)
                data.time = Date.now(); //Returns the numeric value corresponding to the current time—the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC, with leap seconds ignored.
                localStorage.setItem(`${data.id}`, JSON.stringify(data));
            })
        }

    }



    //------------------------חיפוש מטבע-------------------------------
    AllCoins = JSON.parse(localStorage.getItem("AllCoins"))
    $("#SearchInp").keyup(() => SearchFunction())
    $("#SearchBtn").click(() => SearchFunction())

    function SearchFunction() {

        let filtered = AllCoins.filter((Scoin) => {
            return Scoin.symbol.toLowerCase().includes($("input").val().toLowerCase())
        });
        console.log(filtered);
        $('#bodyDiv').empty()
        for (const coin of filtered) {
            DrawCard(coin, JSON.parse(localStorage.getItem(`${coin.id}_Info`)))


        }
        if (!filtered.length) {
            $('#bodyDiv').html(`
            <div class="about">
            
            <img src="pics/item-not-found-feature.jpg" alt="Coin Not Found">
            </div>
            `)
        }
    }
    // ---------------------------------------------------------------
    /* פונקציה לטעינת ציר הזמן */
    function move() {
        let width = 20;
        let i = 0;
        if (i == 0) {
            i = 1;
            let id = setInterval(frame, 9);
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                    $("#ProgressBar").html(`${width}% We are ready...`)
                } else {
                    width++;
                    $("#ProgressBar").width(`${width}%`)
                    $("#ProgressBar").html(`${width}%`)

                }
            }
        }
    }


})


let $progresbar = `<div id="myProgress">
<div id="ProgressBar">20%</div>
</div>`
let $Report = `<div id="chartContainer"></div>`


