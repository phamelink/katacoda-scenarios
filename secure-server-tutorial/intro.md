# Welcome to this tutorial

In this tutorial, you will learn how to secure an application that you want to deploy on a linux server.

The application we will deploy is a simple Express API and a static website, all written in javascript and html. This tutorial assumes that you are familiar with these languages, but if you're not, don't worry. The code is very simple and only serves as an example so we can serve actual content. Everything you will learn here can also be applied to an application written in any other language!

To secure our server, we will start by setting up Nginx as a reverse proxy to safely serve our content. Then, we will enable a firewall and set up secure remote access with SSH.

If any of these terms aren't familiar to you, don't worry! Everything will be explained as we go step by step in this tutorial.

## But why is this necessary ?

When you deploy an API or website on a server, you need to make sure it can be publicly accessed. This simply means that you want people to get your content by typing your server's IP address or domain and have the content appear on their web browser.

This is great and quite easy to do, as you'll see this in the first step of this tutorial. However, having a server open to the network (and the world) makes it vulnerable to attacks. Some dishonest people will see your open server and try to find vulnerabilities to exploit. If they succeed, they might be able to gain access to your server and any secret information you might have stored there! Or, they might use this advantage to serve your users with their own (potentiously malicious) content. Or, if they have access, they could use your server to secretely mine bitcoins using your server's ressources, and your money! Or... Okay, you get the point, which is that you want to make sure that nobody other than authorised entities can access the server, and the only interaction users can have with it is simply through your application.

## Next steps

Now that you're convinced of why this is necessary, let's move on to the next step where we will be deploying our app without any security measures. See you there!
