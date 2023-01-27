//puppeteer kütüphanesini projemize dahil ediyoruz.
const puppeteer = require('puppeteer')

//twitter kullanıcı adı ve şifremizi değişkenlere atıyoruz.
const username = "simgekaya0606"
const password = "Simge2023"

//puppeteer kütüphanesini kullanarak tarayıcıyı başlatıyoruz.
let browser = null
let page = null

let w = 1024
let h = 768

//async fonksiyonlarımızı çalıştırmak için bir fonksiyon oluşturuyoruz.
async function run() {
    try {
        browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] })
        page = await browser.newPage()
        await page.setViewport({ width: w, height: h })
        await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle2' })
        await page.type('input[name="text"]', username, { delay: 50 })
        await page.click('div[class="css-18t94o4 css-1dbjc4n r-sdzlij r-1phboty r-rs99b7 r-ywje51 r-usiww2 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr r-13qz1uu"]',
            { clickCount: 1, delay: 50, }
        )
        await page.click('div[class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0"')
        await page.click('div[class="css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0"',
            { clickCount: 1, delay: 50, }
        )
    } catch (error) {
        console.log(error)
    }
}

run()