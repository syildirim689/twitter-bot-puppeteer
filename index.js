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

//Tweet JSON dosyasını projemize dahil ediyoruz.
const tweet = require('./tweets.json')
const tweets = tweet.tweets.map(tweet => tweet.text)
const randomTweet = tweets[Math.floor(Math.random() * tweets.length)]

//Twitter giriş fonksiyonumuzu oluşturuyoruz.
async function twitterLogin() {
    try {
        console.log("Twitter Bot Başlatılıyor...")
        browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] })
        console.log((await browser.version()) + " başlatıldı.")
        page = await browser.newPage()
        console.log("Sayfa açıldı.")
        await page.setViewport({ width: w, height: h })
        console.log("Sayfa boyutlandırıldı.")
        await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle2' })
        console.log("Twitter'a giriş yapılıyor.")
        await page.type('input[name="text"]', username, { delay: 50 })
        console.log("Kullanıcı adı girildi.")
        await page.click('div[class="css-18t94o4 css-1dbjc4n r-sdzlij r-1phboty r-rs99b7 r-ywje51 r-usiww2 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr r-13qz1uu"]',
            { clickCount: 1, delay: 50, }
        )
        console.log("Şifre ekranına yönlendiriliyor...")
        await page.waitForSelector('input[name="password"]')
        await page.type('input[name="password"]', password, { delay: 50 })
        console.log("Şifre girildi.")
        await page.click('div[class="css-18t94o4 css-1dbjc4n r-1sw30gj r-sdzlij r-1phboty r-rs99b7 r-19yznuf r-64el8z r-1ny4l3l r-1dye5f7 r-o7ynqc r-6416eg r-lrvibr"',
            { clickCount: 1, delay: 50, }
        )
        console.log("Twitter'a giriş yapıldı.")
        await page.waitForSelector('div[class="css-1dbjc4n r-1awozwy r-1p6iasa r-e7q0ms"]')
        await page.click('div[class="css-1dbjc4n r-1awozwy r-1p6iasa r-e7q0ms"]',
            { clickCount: 1, delay: 50, }
        )
    } catch (error) {
        console.log(error)
    }
}

//Tweet yazma fonksiyonumuzu oluşturuyoruz.
async function tweetWrite() {
    try {
        await twitterLogin()
        console.log("Tweet yazma alanına yönlendiriliyor...")
        await page.waitForSelector('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]')
        console.log("Tweet yazılıyor...")
        await page.type('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]', randomTweet, { delay: 50 })
        console.log("Tweet gönderiliyor...")
        await page.click('div[class="css-901oao r-1awozwy r-jwli3a r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0"]',
            { clickCount: 1, delay: 50, }
        )
        console.log("Tweet gönderildi.")
    } catch (error) {
        console.log(error)
    }
    await browser.close()
}

//Tweet beğenme fonksiyonumuzu oluşturuyoruz.
async function tweetLike() {
    try {
        await twitterLogin()
        console.log("Tweet beğenme alanına yönlendiriliyor...")
        await page.goto('https://twitter.com/gitresmi', { waitUntil: 'networkidle2' })
        console.log("Tweet beğeniliyor...")
        // await page.evaluate(() => {
        //     window.scrollBy(0, 1000)
        // })
        await page.waitForSelector('svg[class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"]')
        await page.click('svg[class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"]',
            { clickCount: 1, delay: 50, }
        )
        console.log("Tweet beğenildi.")
    } catch (error) {
        console.log(error)
    }
}

// tweetLike()

//Her dakika bir tweet göndermek için setInterval fonksiyonunu kullanıyoruz.
setInterval(tweetWrite, 40000)
// setInterval(tweetLike, 60000)