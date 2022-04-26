## What is Nginx ?

We've mentioned Nginx and said that we were going to use it as a reverse proxy, but what is it really and what does that even mean ?

Well, first and foremost Nginx is a webserver. Kind of like the API we made. It listens for requests and does stuff depending on what the request is. But Nginx does much more than a simple API.
According to the documentation, "NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more", but in this tutorial we will only explore the reverse proxy part of it.

### Okay, but what is a reverse proxy ?

Before we go into any technical explanation, let's explore an analogy of a reverse proxy.

Imagine a McDonald's restaurant. Let's say you're hungry, and you feel like a Big Mac. Your friend however is feeling more like chicken nuggets. Now let's try and think of what happens when you and your friend make your orders.

Well, when you make your order, since you requested a Big Mac, the cashier transfers your order to the burger station. Then, when your friend orders, the deep frying station will be put to work. When a station finishes cooking the food, it gives it to the cashier who then gives it to the person who ordered that food.

Now we can think of a reverse proxy as that same cashier. When your server gets an API request (a burger order), the reverse proxy transfers your request to the API server running on your machine (the burger station). When the reverse proxy gets a request for a static website (chicken nuggets), it will fetch the files where the static website lies in (the deepfrying station) and send them to the requesting entity (your friend).
