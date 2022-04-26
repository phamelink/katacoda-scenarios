# Deploying a Hello world API and an awesome static website

Welcome to the first step of this tutorial!

Before we begin, let us look briefly at the code we will be using to create our applications.

## Express API

First, change directory to where the API is, and list the files it contains:

```bash
cd /home/projects/express-api && ls
```

You can see here we have three files: `index.js`, `package.json` and `package-lock.json`
`package.json` and `package-lock.json` are the files that contain all the information regarding Node js dependencies and npm scripts. If you're unfamiliar with Node js, just think of npm scripts as command shortcuts to run our code.

The file `index.js` contains the actual code of our API. Take a look by running

```bash
cat index.js
```

### Let's briefly explain what the code does

You should see this code appear on your terminal:

```js
const express = require("express")
const app = express()
const port = 8000

app.get("/hello-world", (req, res) => {
	res.send("Hello World! From your API :)")
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
```

Here, we first import the express library, initialize our API in the `app` variable, and then define our first route that listens for a HTTP `GET` request on relative URI `/hello-world` and replies with a welcoming message.

Then we start our API to listen for requests on port 8000.

### Install dependencies and run our code!

Okay that's great, but we want to see the code in action. To do this we first need to install dependencies with

```bash
npm install
```

This command simply looks for the `package.json` file for a list of dependencies and install them.
This might take a minute so be patient!

Once you've done this, start the server with

```bash
npm run start
```

Now, open a new terminal tab, and execute the following command:

```bash
curl http://localhost:8000/hello-world
```

If you see the "hello world" greeting, then congrats, our API is running and working correctly!

To stop the server, just press `ctrl + C` and you will be back on our familiar terminal.

## Static website

Now, let's look at our static website. Go to its directory using

```bash
cd ../static-website
```

As you can see, there's only one file, `index.html`. This is the file we are going to be serving when a browser types the IP address or domain of our server. Simple as that! Of course you can always make a more complicated website, using React or other frameworks, but that's outside the scope of this tutorial.

## Next step

Okay, now that we installed the dependencies for our API, got it running, and saw where our static website is, let's see how we can actually serve our application to the outside world. We will do this in the next step with an awesome tool called Nginx. See you there!
