Glad you made it! By now, we've set up a reverse proxy with Nginx and made sure that whatever local server we have running or whatever files we are serving, a client has to go through our reverse proxy to get their request fulfilled. That means a malicious attacker will not be able to trick us into accessing unauthorized content, and will have more difficulty finding and exploiting our API server. However, this does not mean we are out of the woods of a potential attack or getting attacked by DoS (Denial of Service). Sure, Nginx can help us prevent DoS attacks on our HTTP port (80) by blacklisting IP addresses or limiting the frequency of requests per client. But there's always a chance they might try and do this through another port.

Let's explain this notion of ports and how they can make our server vulnerable. Ports are like doors on the network to our server. Entities on other networks can gain access to certain services on your server either with TCP or UDP. When a computer opens a port, it means it's listening for requests. That's actually what we've been doing whit Nginx. It listens on port 80, which is the standard HTTP port. Another well know port is 20 for SSH, a service that enables remote access. Having open ports in often necessary, however it leaves a server vulnerable to attacks. This can be for example Denial of Service, where an attacker will send many requests at the same time on a specific port, consuming all your server's ressources, meaning it will be unusable for actual honest users.

## How can you stop this from happening ?

This is where the firewall comes in. A firewall is simply software that let's you decide what requests you allow to come through, and which ones you reject, or even ignore. A firewall usually also has features where you can blacklist IP addresses on a certain port. You can also whitelist Ip addresses, which can be useful for SSH for example if you only want to allow remote access to certain computers.

You can run `sudo lsof -i -P -n | grep LISTEN`{{execute}} to see which ports are open. You see them in the second to last column. For example, you can see here that nginx is listening for TCP connection on port 80, which is how we've been able to see our website in the previous step.

Now, if your API server is still running, you'll see this line in the output:

`node 2445 root 19u IPv6 35748 0t0 TCP *:8000 (LISTEN)`

This actually means that your local API server can be accessed without going through the Nginx reverse proxy we set up earlier before. In fact, go check this out by clicking on the `+` button and click on _Select port to view on Host 1_. Then, in this new tab, select port 8000, and go on the _/api/_ route. You just got a response from our API without passing through our reverse proxy.

#### Wait so everything we did in step 2 was for nothing ?

Well, yes... That is, it was for nothing if we don't do anything about it. Left like this, all the security measures we implemented can just be bypassed by making requests on port 8000 instead of port 80.

#### How do we fix this?

We mentioned in the introduction that we want to restrict access to our server from the outside world as much as possible. To do this, we first need to identify which services we want to allow. The first one we want to leave open is obviously our Nginx reverse-proxy. Thus, we want to leave port 80 open. There is a second one, which is port 22. This port is for SSH. We need this port to be open if we want to be able to have remote access, allowing us to maintain the server and make changes to it.

Leaving anything else open would be taking unnecessary risk and leave our server more vulnerable. So, we need to set up a firewall to block all incoming requests, except those made on port 22 (for SSH) and port 80 (for HTTP).

To do this, we will use a popular firewall software called _ufw_, which stands for _uncomplicated firewall_.

Using _ufw_ is quite straight forward. You tell it which ports you want to allow, and it will drop any other requests. All you need to do is run `ufw allow $PORT`. Easy right ?

Now let's do this to allow HTTP and SSH requests:

`ufw allow 80`{{execute}}
`ufw allow 22`{{execute}}

Now we just need to activate it by running:

`ufw enable`{{execute}}

When prompted with `Command may disrupt existing ssh connections. Proceed with operation (y|n)?`, type "y". They are simply warning us that if we don't allow access to port 22, then some ssh connections might drop, which makes perfect sense since we would be telling the firewall to drop incoming SSH requests, meaning any active connection would cease to work!

You can see all the rules you've set up like this

`ufw status`{{execute}}

We see that the firewall allows acces from anywhere to port 80 and port 22. Awesome, now make sure this works by opening up a new tab with _Select port to view on Host 1_ and try making a request on port 80. No response means it's working. Congrats! You've successfully activated a firewall, bringing us one step closer to securely deploying our application.

Let's meet in the next step, where we'll be adding extra security measures to our remote access to this server! See you there!
