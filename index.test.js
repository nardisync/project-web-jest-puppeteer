const puppeteer = require('puppeteer');


function getAppPath(){
    // Return the current direcotry path
    // adjusting it for Linux or Windows
    const fs = require("fs");

    let path = __dirname;
    
    if(path.includes("home/")){
        // We are on Linux
        path = path + "/index.html";
    } else {
        // We are on Window
        path = path + "\\index.html"
    }

    console.log(" ---- Current path: " + path)

    if (fs.existsSync(path)) {
      // path exists
      console.log("Exists:", path);
    } else {
      console.log("DOES NOT exist:", path);
    }
    return path
}

const app = getAppPath();

// Async because we use promise inside of this test
test('Lanching Google', async () => {

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: ['--window-size=1280,800']    
    });

    const page = await browser.newPage();
    await page.goto("https://www.google.it");

    await browser.close();
}, 10000);

test('Validating first name field', async () => {

    // This will open the browser and start the test.
    // Default is headless (background)
    // It return a promise, so we need to wait for the promise
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: ['--window-size=1280,800']    
    });
    console.log("Log: " + browser)
    console.info("Info: " + browser)
    const page = await browser.newPage();
    await page.goto(app);

    // Now we are on the page
    await page.click('input#form-name');
    await page.type('input#form-name', 'Marco');
    await page.click('input#form-surname');

    // Prende un selettore e una callback function
    const nameInputClass = await page.$eval(
        'input#form-name', input => input.value
    );
    expect(nameInputClass).toBe('Marco')
    await browser.close();
}, 10000);

test('Validating surname field', async () => {

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: ['--window-size=1280,800']    
    });
    const page = await browser.newPage();
    console.log("Going for the app ath the location : " + app)
    await page.goto(app);

    // Now we are on the page
    await page.click('input#form-surname');
    await page.type('input#form-surname', 'Nardi');
    await page.click('input#form-name');

    // Prende un selettore e una callback function
    const surnameInputClass = await page.$eval(
        'input#form-surname', 
        input => input.value
    );
    expect(surnameInputClass).toBe('Nardi')
    await browser.close();
}, 10000);

test('Validating email field', async () => {

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: ['--window-size=1280,800']    
    });
    const page = await browser.newPage();
    await page.goto(app);

    // Now we are on the page
    await page.click('input#form-email');
    await page.type('input#form-email', 'emaildiprova@random.com');
    await page.click('input#form-name');

    // Prende un selettore e una callback function
    const emailInputClass = await page.$eval(
        'input#form-email', 
        input => input.value
    );
    expect(emailInputClass).toBe('emaildiprova@random.com')
    await browser.close();
}, 10000);

test('Validating age field with Alert', async () => {

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: ['--window-size=1280,800']    
    });
    const page = await browser.newPage();
    await page.goto(app);

    // On event listener trigger
    page.on('dialog', async dialog => {
        // Get alert message
        console.log(dialog.message());
        expect(dialog.message()).toBe('You must be at least 18 for apply for this job!')
        // Accept alert
        await dialog.accept();
    })
    
    // Now we are on the page
    // and we input the wrong age
    await page.click('input#form-age');
    await page.type('input#form-age', '15');
    await page.click('input#form-name');

    // We check that the form is reseted
    const wrorngAgeInputClass = await page.$eval(
        'input#form-age', 
        input => input.value
    );
    expect(wrorngAgeInputClass).toBe('')

    // Now we input the right age
    await page.click('input#form-age');
    await page.type('input#form-age', '25');
    await page.click('input#form-name');

    // We check for the right message salved on the form
    const rightAgeInputClass = await page.$eval(
        'input#form-age', 
        input => input.value
    );
    expect(rightAgeInputClass).toBe('25')
    await browser.close();
}, 10000);

test('Validating submit button', async () => {

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        args: ['--window-size=1280,800']    
    });
    const page = await browser.newPage();
    await page.goto(app);

    // We click the submit with empy fields
    await page.click('button#submit-button');

    // We expect and empty feedback paragraph
    const feedbackEmpty = await page.$("[id=submit-feedback]")
    const textFeedbackEmpty = await (await feedbackEmpty.getProperty('textContent')).jsonValue()
    expect(textFeedbackEmpty).toBe("")

    await page.click('input#form-name');
    await page.type('input#form-name', 'Marco');

    await page.click('input#form-surname');
    await page.type('input#form-surname', 'Rossi');

    await page.click('input#form-email');
    await page.type('input#form-email', 'emaildiprova@random.com');

    await page.click('input#form-age');
    await page.type('input#form-age', '33');

    await page.click('#sex-form-Not');
    await page.click('button#submit-button');

    // We expect and empty feedback paragraph
    const feedbackFull = await page.$("[id=submit-feedback]")
    const textFeedbackFull = await (await feedbackFull.getProperty('textContent')).jsonValue()
    expect(textFeedbackFull).toBe("Your name is Marco Rossi.A person of 33 years. The email that you insert is : 'emaildiprova@random.com'.")

    await browser.close();
}, 10000);
