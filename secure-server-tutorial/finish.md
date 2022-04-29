## Time to say Goodbye!

Today we learned how we can implement simple security measures when deploying an application. This obviously doesn't guarantee you that your server will never get attacked, but it just makes it whole lot harder to do.

Everything you learned today, from setting up a reverse proxy, to securing remote access and enabling a firewall, are all things that you need to set up on your original deployment. But once they're done, there is very little do for maintenance. This is where you can start intergrating CD (continuous deployment). Why not set up a github action to automatically transfer pushed code to your server ? You want to add a django API for version 2 ? Just add a _location_ bloc in your nginx configurations to serve that! Getting more and more users everyday ? Use nginx's loadbalancing features!

There are endless ways you can make deploying new updates to your application seamless and in a secure way.
