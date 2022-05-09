Welcome to the 4th and final step of this tutorial. Here, we will briefly explain how SSH remote access works and finally how we implement some security measures such as limiting permissions and removing password authentication to use a more secure SSH key authentication.

### What is SSH and why use it for remote access

SSH, or Secure Shell Protocol, is a remote administration protocol that allows users to access their servers remotely over the internet. The service was created using cryptographic techniques to ensure that all communication going to and from a remote server is encrypted.

To use it, a client who wants to connect to a host must first authenticate themselves. This is done either with password authentication or with SSH key pairs.

### Security measures we will implement

On most systems, the default configuration for SSH is to allow password authentication. This means that when you try and connect to a host, you type in the password for that user you want to log in as, and you get in. Password authentication can be practical. It's easy to use from anywhere since no setup is required. However, this comes at a cost. Brute forcing methods can be applied to try and gain access and if a user doesn't choose a **strong password** then it is very likely an attacker will succeed. Of course The better alternative is thus to use SSH key pairs.

SSH key pairs are a set of asymmetric keys used to authenticate a user. A user generates a pair of keys on their personal computer, then the public key that was generated is added to a list of authorized keys on the host. This will allow a user to authenticate themselves without having to type in a password and will be more secure than using passwords because they are much harder to break.

Another security measure we will be taking is disabling root login. When a user gains access to a server, we want to make sure he does not have root privileges. This is simply because a user who has root privileges can do absolutely anything he wants with your server.
Instead, we want to give him normal access, with the possibility of switching to being a root user. Since you need to know the root user's password, this adds an extra layer of security.

### SSH configurations

Before we go into the details of how we can secure our remote connections, let's have a look at how we can make configurations for this service:

`cat /etc/ssh/sshd_config`{{execute T1}}

As you can see, it contains a lot of information. Lines starting with a _#_ are commented. Each line defines one setting.

To disable root login and password authentication, make sure this file contains the following lines:

`PasswordAuthentication no` and `PermitRootLogin no`

You can make these changes directly using these commands:

`sed --in-place 's/^#PermitRootLogin.*/PermitRootLogin no/g' /etc/ssh/sshd_config`{{execute T1}}
`sed --in-place 's/^PasswordAuthentication.*/PermitRootLogin no/g' /etc/ssh/sshd_config`{{execute T1}}

It is important to note here that on a katacoda machine, by default you are a root user. You can verify this by running `whoami`{{execute T1}}, which should tell you that you are the root use.

## Creating a non-root user

Now, we need to create a user, without root privileges, which we will use for our login. To do this, run

`useradd -m -d /home/linus linus`{{execute T1}}

The options here are just to add a home directory for this new user.

Awesome, now if you switch user with `su linus`{{execute T1}} and run `cd /root`{{execute T1}}, you see you're not allowed access to this folder. This is exactly what we want for a user logging on to our server through SSH. To double-check, run `whoami`{{execute T1}} and you'll see that your username is _linus_. 

## Setting up SSH keys

The first thing you need to do when you want to log in with an SSH key is to create a key pair. In this tutorial we are going to create another user, that will act as an external client. Everything you do with this user can be replicated on your own computer if you want to set up SSH key authentication. Start by going to another tab and adding a user named _torvald_.

`useradd -m -d /home/torvald torvald`{{execute T2}}

Now switch users with `su torvald`{{execute T2}} and change directory to your new user's home directory: `cd /home/torvald`{{execute T2}}.

To create an SSH key pair, simply run the command `ssh-keygen`{{execute T2}}. Press enter on the prompt to accept the default file in which to save the key and give a passphrase that you'll need to enter every time you want to use it (leaving it blank means you won't be asked for a password).

*If you want to go even further into understanding how SSH key authentication works, you can check out this [article](https://goteleport.com/blog/comparing-ssh-keys/). They go into detail on how asymmetric key authentication works and which encryption algorithms you can use with `ssh-keygen`*

Now if you look into the _.ssh_ directory `ls /home/torvald/.ssh`{{execute T2}}, you see you have a _id_rsa_ and _id_rsa.pub_ file. The first is your private key, NEVER share this with anyone, because it's secret. The second is your public key. This key is used by SSH to verify who you are.

Awesome, now let's try and log in with SSH as linus. To do this, you need to know your server IP address, but since we are doing this locally, you can just use the localhost IP address:

`ssh linus@localhost`{{execute T2}}

When prompted with 

`The authenticity of host 'localhost (127.0.0.1)' can't be established. ECDSA key fingerprint is SHA256:... Are you sure you want to continue connecting (yes/no/[fingerprint])?`

reply *yes*. This is simply SSH taking precautions, but since we know who we are trying to connect to we have nothing to worry about.

Wait, it says _Permission denied (publickey)_. Well, that's because we didn't officially authorize torvald to gain access as linus through SSH. Let's do that now!

## Authorize SSH keys

To allow users to log in through SSH with key authentication, the first thing we need to do is let SSH know who is allowed access. This is done by creating a directory in your user's home directory named _.ssh_ and adding a file called _authorized\_keys_.
To do this, go into another tab as linus and run

```sh
mkdir /home/linus/.ssh

cd /home/linus/.ssh

touch authorized_keys
```{{execute T1}}

Then you need to copy torvald's public key into *authorized_keys*. You can either manually copy and paste torvald's public key, or just run this command into another tab as root:

`cat /home/torvald/.ssh/id_rsa.pub >> /home/linus/.ssh/authorized_keys`{{execute T3}}

Great, now go back to the terminal tab where torvald is and try to SSH as linus again:

`ssh linus@localhost`{{execute T2}}

It worked! Just to make sure, run `whoami`{{execute T2}} and you'll see that we were successful.

We've now made sure that our remote access will be a little more secure, and in the process, we learned how to generate and authorize SSH key pairs! 
