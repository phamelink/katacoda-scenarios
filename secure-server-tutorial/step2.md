## What is Nginx?

We've mentioned Nginx and said that we were going to use it as a reverse proxy, but what is it really and what does that even mean?

Well, first and foremost Nginx is a web server. Kind of like the API we made. It listens for requests and does stuff depending on what the request is. But Nginx does much more than a simple API.
According to the [documentation](https://www.nginx.com/resources/glossary/nginx/#:~:text=NGINX%20is%20open%20source%20software,for%20maximum%20performance%20and%20stability.), "NGINX is open-source software for web serving, reverse proxying, caching, load balancing, media streaming, and more", but in this tutorial, we will only explore the reverse proxy part of it.

### Okay, but what is a reverse proxy?

Before we go into any technical explanation, let's explore an analogy of a reverse proxy.

Imagine a McDonald's restaurant. Let's say you're hungry, and you feel like a Big Mac. Your friend however is feeling more like chicken nuggets. Now let's try and think of what happens when you and your friend make your orders.

Well, when you make your order since you requested a Big Mac, the cashier transfers your order to the burger station. Then, when your friend orders, the deep frying station will be put to work. When a station finishes cooking the food, it gives it to the cashier who then gives it to the person who ordered that food.

Now we can think of a reverse proxy as that same cashier. When your server gets an API request (a burger order), the reverse proxy transfers your request to the API server running on your machine (the burger station). When the reverse proxy gets a request for a static website (chicken nuggets), it will fetch the files where the static website lies (the deep frying station). When either station (the file system or the API server) returns with the requested content, the reverse proxy will pass them along to the requesting entity.

In Nginx, the service we use, whether it is a running API server or a static website we want to serve, is known as a _virtual host_ or _vhost_. 

Here is a diagram of what a reverse proxy looks like to give you a better idea:

![Reverse Proxy Diagram](./assets/reverse_proxy_diagram.png)

### Okay, but why does it make our server more secure?

Since our application server is only accessible through our reverse proxy and the internal network, malicious entities cannot access the servers directly to exploit vulnerabilities.

Nginx also offers many other features such as denylisting IP addresses or limiting the number of connections from each client which help reduce the risk of distributed denial-of-service attacks (DDoS). 

### Let's use it!

Okay so now that you understand what a reverse proxy is, let's use one!

Before we begin, it is important to mention Nginx is already installed here. If you want to try doing this on your own linux server, all you need to do is run these 2 commands:

```bash
sudo apt update && sudo apt install Nginx
```

### Nginx structure

Everything needed to configure your Nginx lies in `/etc/nginx`. Inside this directory, there is an `nginx.conf` that contains the global configuration for Nginx.

Two other directories are important to mention

-  `/etc/nginx/sites-available/` Here we store the configuration files for each virtual host, whether we want to enable them or not.
-  `/etc/nginx/sites-enabled/` We use this folder to create symbolic links to the vhosts we want to be enabled in the _sites-available_ directory.

### Let's run Nginx!

Now let's see what happens when we start the Nginx webserver. To do this, run the following command in your terminal:

`service nginx start`{{execute}}

Now, press the `+` button and select _View HTTP port 80 on Host 1_. This will open a new tab in your browser that connects to your server from an external network. You should see a default _Welcome to nginx!_ page.

Congrats! You just successfully ran your first reverse proxy!

Now the question remains, where does this page come from? Well, if you look into the _sites-available_ directory, you'll see a _default_ file. This file contains the default vhost's configuration. When you examine the file, there is the line in the `server {}` block:

`root /var/www/html;`

This is the directory that contains a single HTML file, `index.nginx-debian.html`, which is the page that was loaded by default. What's happening is when you make an HTTP request on port 80, Nginx matches this server block and by default serves the first \*.html file it can find inside the `root` directory mentioned above.

Now, let's see how we can customize our Nginx configurations to match our needs.

### Customize Nginx configurations

Remember how there were two directories, _sites-available_, and _sites-enables_? Well, we know that the former contains the configurations for all our virtual hosts, and the latter lets us enable or disable them as we wish. Let's start by disabling the _default_ vhost, by running

`sudo unlink /etc/nginx/sites-enabled/default`{{execute}}

Now let's create a new virtual host, by creating a file in _sites-enabled_:

```sh
cd /etc/nginx/sites-available
touch custom_rp.conf
```{{execute}}

Now, add the following text inside that file. You can use the nano editor to do this: `nano custom_rp.conf`{{execute}}
Copy the code and when you're done, you can close it with <kbd>Ctrl</kbd>+<kbd>X</kbd>.

```nginx
server { 
    # Set default website folder
    root /home/projects/static-website;

    # Listen on port 80
    listen 80;

}
```{{copy}}

Here we create a server block, that listens for requests made to port 80, and by default serves our `index.html` file in our _static-website_ folder.

Okay, now that we have the configuration for a virtual host, we need to enable it. This is done by adding a symbolic link between the file in _sites-available_ and _sites-enabled_:

`sudo ln -s /etc/nginx/sites-available/custom_rp.conf /etc/nginx/sites-enabled/custom_rp.conf`{{execute}}

To see all your symbolic links in a directory and to make sure this command was successful, you can run `ls /etc/nginx/sites-enabled/ -l`{{execute}}.

Awesome, now you need to restart Nginx so it accepts our modifications. To do this, run

`service nginx restart`{{execute}}

Now, open up HTTP port 80 on Host 1 just like before and you'll see now that we're serving our own static website!

This is cool, but we still have an API server that we want to use. Let's add some configurations to our reverse proxy!

### Adding our API server in the virtual host

By convention, API URIs are served on a `/api/` route, and any other route will serve static files. To do this, add the following lines in our _custom_rp.conf_ file so it looks like this:

```nginx
    # Any matches to /api/* will proxy the request
    # to our running API server
    location /api/ {
        proxy_pass http://localhost:8000;
    }
```{{copy}}

Edit with `nano custom_rp.conf`{{execute}} and quit with <kbd>Ctrl</kbd>+<kbd>X</kbd>.

```nginx
server { 
    # Set default website folder
    root /home/projects/static-website;

    # Listen on port 80
    listen 80;

    # Any matches to /api/* will proxy the request
    # to our running API server
    location /api/ {
        proxy_pass http://localhost:8000;
    }

}
```

Now restart Nginx and also don't forget to run our API server if it's not already running:

`service nginx restart`{{execute}}

```sh
cd /home/projects/express-api 
npm run start
```{{execute T1}}

Now, in our HTTP Client 1, add the _/api/_ route in the URL. You should see the response from the express API server. Congrats! You just successfully configured a reverse proxy, bringing us one step closer to deploying our server securely.

To find out more about what you can do with Nginx, check out their [docs](https://nginx.org/en/docs/beginners_guide.html) for more examples!

## Note on integrating continuous deployment

In the introduction of this tutorial, we briefly mentioned continuous deployment and how we can integrate it on our server. Well, as you can imagine, with Nginx this became a whole lot easier.

Imagine you and your development team are working tirelessly on new features for your static website, or, better yet, you guys are building a whole web app with React. Well, with the right Nginx configurations, all you need to do is make sure you have a server block that serves the right static files, and if the content of any of those files changes in any way, Nginx couldn't care less! It will simply start serving these new files next time someone requests them. With a React application, for example, all you need to do is make sure that Nginx serves files in the _build_ folder and make an automation that whenever there's a new update to your React code, you build that code, and Nginx will serve that content. Easy right?

Anyway, let's start with another important step in deploying a secure server, which is setting up a firewall. See you there!

## Troubleshooting

If you can't get access to the `/api/` route on a new katacoda terminal tab, make sure the server is running with `cd /home/projects/express-api && npm run start`. You can check that this is working by running  `curl http://localhost:8000/api/` from another terminal tab.