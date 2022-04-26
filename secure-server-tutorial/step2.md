## What is Nginx ?

We've mentioned Nginx and said that we were going to use it as a reverse proxy, but what is it really and what does that even mean ?

Well, first and foremost Nginx is a webserver. Kind of like the API we made. It listens for requests and does stuff depending on what the request is. But Nginx does much more than a simple API.
According to the documentation, "NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more", but in this tutorial we will only explore the reverse proxy part of it.

### Okay, but what is a reverse proxy ?

Before we go into any technical explanation, let's explore an analogy of a reverse proxy.

Imagine a McDonald's restaurant. Let's say you're hungry, and you feel like a Big Mac. Your friend however is feeling more like chicken nuggets. Now let's try and think of what happens when you and your friend make your orders.

Well, when you make your order, since you requested a Big Mac, the cashier transfers your order to the burger station. Then, when your friend orders, the deep frying station will be put to work. When a station finishes cooking the food, it gives it to the cashier who then gives it to the person who ordered that food.

Now we can think of a reverse proxy as that same cashier. When your server gets an API request (a burger order), the reverse proxy transfers your request to the API server running on your machine (the burger station). When the reverse proxy gets a request for a static website (chicken nuggets), it will fetch the files where the static website lies in (the deepfrying station). When either station (the file system or the API server) returns with the requested content, the reverse proxy will pass them along to the requesting entitiy.

In Nginx, the service we use, wether it is a running API server or a static website we want to serve, is known as a _virtual host_ or _vhost_.

### Okay, but why does it make our server more secure ?

Since our application server is only accessible through our reverse proxy and the internal network, malicious entities cannot access the servers directly to exploit vulnerabilities.

Nginx also offers many other features such as blacklisting IP addresses or limiting the number of connections from each client which help reducing the risk of distributed denial-of-service attacks (DDoS).

### Let's use it!

Okay so now that you understand what a reverse proxy is, let's use one!

Before we begin, I need to mention Nginx is already installed here. If you want to try doing this on your own linux server, all you need to do is run these 2 commands:

```bash
sudo apt update && sudo apt install nginx
```

### Nginx structure

Everything needed to configure your Nginx lies in `/etc/nginx`. Inside this directory, there is a `nginx.conf` that contains the global configuration for Nginx.

There are two other directories that are import to mention

-  `/etc/nginx/sites-available/` Here we store the configuration files for each virtual host, wether we want to enable them or not.
-  `/etc/nginx/sites-enabled/` We use this folder to create symbolic links to the vhosts we want enabled in the _sites-available_ directory.

```nginx
server {
    # Set default website folder
    root /home/projects/static-website;

    # Listen on port 43
    listen 80;

    # Any matches to /api/* will proxy the request
    # to our running API server
    location /api/ {
        proxy_pass http://localhost:8000;
    }
}
```

With SSL

```nginx
server {

    # Listen on port 80 and 443
    # on both IPv4 and IPv6
    listen 80;
    listen [::]:80 ipv6only=on;
    listen 443 ssl;
    listen [::]:443 ipv6only=on ssl;

    # Set website folder
    root /path/to/your/website;

    # Enable SSL
    ssl_certificate your-cert.pem;
    ssl_certificate_key your-cert.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv3:+EXP;
    ssl_prefer_server_ciphers on;
}
```
