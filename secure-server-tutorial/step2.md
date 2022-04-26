## What is Nginx ?

We've mentioned Nginx and said that we were going to use it as a reverse proxy, but what is it really and what does that even mean ?

Well, first and foremost Nginx is a webserver. Kind of like the API we made. It listens for requests and does stuff depending on what the request is. But Nginx does much more than a simple API.
According to the documentation, "NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more", but in this tutorial we will only explore the reverse proxy part of it.

### Okay, but what is a reverse proxy ?

Before we go into any technical explanation, let's explore an analogy of a reverse proxy.

Imagine a McDonald's restaurant. Let's say you're hungry, and you feel like a Big Mac. Your friend however is feeling more like chicken nuggets. Now let's try and think of what happens when you and your friend make your orders.

Well, when you make your order, since you requested a Big Mac, the cashier transfers your order to the burger station. Then, when your friend orders, the deep frying station will be put to work. When a station finishes cooking the food, it gives it to the cashier who then gives it to the person who ordered that food.

Now we can think of a reverse proxy as that same cashier. When your server gets an API request (a burger order), the reverse proxy transfers your request to the API server running on your machine (the burger station). When the reverse proxy gets a request for a static website (chicken nuggets), it will fetch the files where the static website lies in (the deepfrying station). When either station (the file system or the API server) returns with the requested content, the reverse proxy will pass them along to the requesting entitiy.

In Nginx, the service we use, whether it is a running API server or a static website we want to serve, is known as a _virtual host_ or _vhost_.

### Okay, but why does it make our server more secure ?

Since our application server is only accessible through our reverse proxy and the internal network, malicious entities cannot access the servers directly to exploit vulnerabilities.

Nginx also offers many other features such as blacklisting IP addresses or limiting the number of connections from each client which help reducing the risk of distributed denial-of-service attacks (DDoS).

### Let's use it!

Okay so now that you understand what a reverse proxy is, let's use one!

Before we begin, it is important to mention Nginx is already installed here. If you want to try doing this on your own linux server, all you need to do is run these 2 commands:

```bash
sudo apt update && sudo apt install nginx
```

### Nginx structure

Everything needed to configure your Nginx lies in `/etc/nginx`. Inside this directory, there is a `nginx.conf` that contains the global configuration for Nginx.

There are two other directories that are import to mention

-  `/etc/nginx/sites-available/` Here we store the configuration files for each virtual host, wether we want to enable them or not.
-  `/etc/nginx/sites-enabled/` We use this folder to create symbolic links to the vhosts we want enabled in the _sites-available_ directory.

### Let's run Nginx!

Now let's see what happens when we start the Nginx webserver. To do this, run the following command in your terminal:

```bash
service nginx start
```

Now, in press on the `+` button and select _View HTTP port 80 on Host 1_. This will open a new tab in your browser that connects to your server from an external network. You should see a default _Welcome to nginx!_ page.

Congrats! You just successfully ran your first reverse proxy!

Now the question remains, where does this page come from? Well, if you look into the _sites-available_ directory, you'll see a _default_ file. This file contains the default vhost's configuration. When you examine the file, there is the line in the `server {}` block:

`root /var/www/html;`

This is the directory that contains a single html file, `index.nginx-debian.html`, which is the page that was loaded by default. What's really happening is when you make an HTTP request on port 80, Nginx matches this server block and by default serves the first \*.html file it can find inside the `root` directory mentioned above.

Now, let's see how we can customize our Nginx configurations to match our needs.

### Customize Nginx configurations

Remember how there were two directories, _sites-available_ and _sites-enables_ ? Well we know that the former contains the configurations for all our virtual hosts, and the latter let's us enable or disable them as we wish. Let's start by disabling the _default_ vhost, by running

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

Now let's create a new virtual host, by creating a file in _sites-enabled_:

```bash
cd /etc/nginx/sites-available && touch custom_rp.conf
```

Now, add the following text inside that file:

```nginx
server {
    # Set default website folder
    root /home/projects/static-website;

    # Listen on port 80
    listen 80;
}
```

Here we create a server block, that listens for requests made to port 80, and by default serves our `index.html` file in our _static-website_ folder.

Okay, now that we have the configuration for a virtual host, we need to enable it. This is done by adding a symbolic link between the file in _sites-available_ and _sites-enabled_:

```bash
sudo ln -s /etc/nginx/sites-available/custom_rp.conf /etc/nginx/sites-enabled/custom_rp.conf
```

To see all your symbolic links and to make sure this command was successfull, you can run `ls -l`.

Awesome, now you need to restart Nginx so it accepts our modifications. To do this, run

```bash
service nginx restart
```

Now, open up client 1 just like before and you'll see now that we're serving our own static website!

This is cool, but we still have an API server that we want to use. Let's add some configurations to our reverse-proxy!

### Adding our API server in the virtual host

By convention, API URIs are served on the on a `/api/` route, and any other route will serve static files. To do this, add the following lines in our _custom_rp.conf_ file so it looks like this:

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

```bash
service nginx restart
cd /home/projects/express-api && npm run start
```

Now, in our HTTP Client 1, add the _/api/_ route in the url. You should see the response from the express API server. Congrats! You just successfully configured a reverse proxy, bringing us one step closer to deploying our server securely.

## Note on intergrating continous deployment

In the introduction of this tutorial we breifly mentioned continous deployment and how we can integrate it on our server. Well, as you can imagine, with Nginx this became a whole lot easier.

Imagine you and your development team are working tirelessly on new features for your static website, or, better yet, you guys a building whole web app with React. Well, with the right Nginx configurations, all you need to do is make sure you have a server block that serves the right static files, and if the content of any of those files changes in any way, Nginx couldn't care less! It will simply start serving these new files next time someone requests them. With a React application for example, all you need to do is make sure that Nginx serves files in the _build_ folder and make an automation that whenever there's a new update to your React code, you build that code and Nginx will serve that content. Easy right ?

Anyway, let's start with another important step in deploying a secure server, which is setting up a firewall. See you there!
