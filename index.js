//puppeteer kütüphanesini projemize dahil ediyoruz.
const puppeteer = require('puppeteer')

//dotenv kütüphanesini projemize dahil ediyoruz.
require('dotenv').config()

//twitter kullanıcı adı ve şifremizi değişkenlere atıyoruz.
const username = process.env.TWITTER_USERNAME
const password = process.env.TWITTER_PASSWORD

//puppeteer kütüphanesini kullanarak tarayıcıyı başlatıyoruz.
let browser = null
let page = null

let w = 1024
let h = 768

//Tweet JSON dosyasını projemize dahil ediyoruz.
const tweet = require('./tweets.json')
const tweets = tweet.tweets.map(tweet => tweet.text)

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
        browser.close()
    }
}

//Tweet yazma fonksiyonumuzu oluşturuyoruz.
async function tweetWrite() {
    try {
        await twitterLogin()
        console.log("Tweet yazma alanına yönlendiriliyor...")
        await page.waitForSelector('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]')
        console.log("Tweet yazılıyor...")
        const randomTweet = tweets[Math.floor(Math.random() * tweets.length)]
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
        await page.goto('https://twitter.com/gitresmi/with_replies', { waitUntil: 'networkidle2' })
        console.log("Tweet beğeniliyor...")
        while (true) {
            const tweets = await page.$$('[data-testid="tweet"]')
            for (const tweet of tweets) {
                try {
                    const isAd = await tweet.$('[data-testid="ad-badge"]')
                    if (isAd) {
                        continue
                    }
                    const likeButton = await tweet.$('[data-testid="like"]')
                    const isLiked = likeButton ? (await (await likeButton.getProperty('aria-pressed')).jsonValue()) === true : false
                    if (!isLiked) {
                        if (likeButton) {
                            await likeButton.click()
                        }
                        console.log("Tweet beğenildi.")
                    }
                    const retweetButton = await tweet.$('[data-testid="retweet"]')
                    const isRetweeted = retweetButton ? (await (await retweetButton.getProperty('aria-pressed')).jsonValue()) === true : false
                    const retweetButton2 = await page.$('[data-testid="retweetConfirm"]')
                    const isRetweetedConfirm = retweetButton2 ? (await (await retweetButton2.getProperty('aria-pressed')).jsonValue()) === true : false
                    // if (!isRetweeted && !isRetweetedConfirm) {
                    //     if (retweetButton) {
                    //         await retweetButton.click()
                    //         await retweetButton2.click()
                    //     }
                    //     console.log("Tweet retweetlendi.")
                    // }
                    if (!isRetweeted) {
                        if (retweetButton) {
                            await retweetButton.click()
                        }
                        console.log("Tweet retweetlendi.")
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            })
            const hasMoreTweets = await page.evaluate(() => {
                const tweets = document.querySelectorAll('[data-testid="tweet"]');
                const lastTweet = tweets[tweets.length - 1];
                const lastTweetRect = lastTweet.getBoundingClientRect();
                return lastTweetRect.bottom <= window.innerHeight;
            })
            if (!hasMoreTweets) {
                break
            }
        }
        await browser.close()
    } catch (error) {
        console.log(error)
        await browser.close()
    }
}

//tweetLike()
//tweetWrite()

//Her dakika bir tweet göndermek için setInterval fonksiyonunu kullanıyoruz.
setInterval(tweetWrite, 30000)
setInterval(tweetLike, 110000)