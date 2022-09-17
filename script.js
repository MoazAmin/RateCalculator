class exchange_rate {
    constructor(previousDisplay,currentDisplay) {
        this.previousDisplay = previousDisplay
        this.currentDisplay = currentDisplay
        this.clear()
    }
    clear(){
        this.visit = ''
        this.home = ''
    }
    appendNumber(number) {
        this.visit = this.visit.toString() + number.toString()
    }
    getDisplayNumber(number){
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber)
        if (isNaN(integerDigits))
        {
            return ''
        }
        const pattern=/^\d+(\.\d{2})?$/;
        if(pattern.test(integerDigits))
        {
            return this.thousands_separators(integerDigits)
        }
        else
        {
            const j = Math.ceil(integerDigits)
            return this.thousands_separators(j)
        }

    }
    thousands_separators(num)
    {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }
    updateDisplay() {
        this.previousDisplay.innerText =
            this.getDisplayNumber(this.home)
        this.currentDisplay.innerText =
            this.getDisplayNumber(this.visit)

    }
    calculate() {
        let stringified = JSON.parse(localStorage.getItem("Currency&rates"));
        let visiting_CurrencyRate = (stringified.currencies.find(o => o.name === selection.value) );
        let home_CurrencyRate = (stringified.currencies.find(o => o.name === selection2.value ));
        console.log(this.visit)
        console.log(selection3.value)

        console.log(visiting_CurrencyRate.rate)
        console.log(home_CurrencyRate.rate)



        let results      = (this.visit / visiting_CurrencyRate.rate) * home_CurrencyRate.rate
        let bankResults  = results + (results * selection3.value)
        this.home    = bankResults
        this.visit   = ''


    }
    setLocalHome(){
        localStorage.setItem('Visiting',selection.value)
        localStorage.setItem('Home',selection2.value)
        localStorage.setItem('BankRate',selection3.value )

    }
    getLocalHome(){
        selection.value  = localStorage.getItem('Visiting')
        selection2.value = localStorage.getItem('Home')
        selection3.value = localStorage.getItem('BankRate')
        result.innerText    = localStorage.getItem('Visiting')
        result2.innerText    = localStorage.getItem('Home')
    }

}
const previousDisplay    = document.querySelector('[data-previous]')
const currentDisplay     = document.querySelector('[data-current]')
const Numbers            = document.querySelectorAll('[data-number]')
const equalsButton       = document.querySelector('[data-equal]')
const allClearButton     = document.querySelector('[data-clear]')
let selection            = document.getElementById('list1')
let selection2           = document.getElementById('list2')
let result               = document.getElementById('h2')
let result2              = document.getElementById('h3')
let selection3           = document.getElementById('list3')
const day                = document.querySelector('[have-mercy]')


const Exchange = new exchange_rate(previousDisplay,currentDisplay)

Numbers.forEach(button => {
    button.addEventListener('click', () => {
        Exchange.appendNumber(button.innerText)
        Exchange.updateDisplay()

    })
})

allClearButton.addEventListener('click', button => {
    Exchange.clear()
    Exchange.updateDisplay()
})

selection.addEventListener('change', () => {
    result.innerText = selection.options[selection.selectedIndex].text
})

selection2.addEventListener('change', () => {
    result2.innerText = selection2.options[selection2.selectedIndex].text
})

equalsButton.addEventListener('click', button => {
    Exchange.calculate()
    Exchange.updateDisplay()
    Exchange.setLocalHome()

})
document.addEventListener("DOMContentLoaded", function(){
    if (localStorage.getItem("Visiting") === null) {
        selection.value  = 'EUR'
        selection2.value = 'GBP'
        selection3.value = '0'
        checkInternetConnection()
    }
    else
    {
        Exchange.getLocalHome()
        checkInternetConnection()
    }

});

// This Section I will attempt to store the XML into the Database


function CurrencyRates() {
    let url = "https://devweb2020.cis.strath.ac.uk/~aes02112/ecbxml.php";
    fetch(url)
        .then(response => response.text())
        .then(data => {
            //console.log(data);  //string
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");
            let childNodes = xml.getElementsByTagName("Cube")[1].childNodes;
            let childNodeList = [];
            let childNode;
            for (childNode of childNodes) {
                childNodeList.push(childNode);
            }
            childNodes = childNodeList.filter(element => element.nodeName === "Cube");
            let currencies = childNodes.map(element => {
                let currency = {};
                currency.name = element.getAttribute("currency");
                currency.rate = element.getAttribute("rate");

                return currency;
            });
            currencies.push({name: "EUR", rate: "1.0"});
            localStorage.setItem("Currency",currencies.name)
            localStorage.setItem("Rate",currencies.rate)
            let hi = {currencies}
            localStorage.setItem("Currency&rates", JSON.stringify(hi));
            return currencies;


        });

}
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

let HI = mm + '/' + dd + '/' + yyyy;


function checkInternetConnection() {
    let isOnLine = navigator.onLine;
    if (isOnLine) {
        setInterval(CurrencyRates(), 1000 * 60 * 60 * 24);
        localStorage.setItem("Date",HI)
        day.innerHTML = 'Rate of ' + HI
    } else {
        localStorage.getItem("Date");
        day.innerHTML = 'Rate of ' + HI
    }
}
localStorage.removeItem("Rate")
localStorage.removeItem("Currency")

