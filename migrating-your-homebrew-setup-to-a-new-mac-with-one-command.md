---
title: Migrating Your Homebrew Setup to a New Mac with One Command
description: Easily migrate your entire Homebrew setup to a new Mac with just one simple command. This step-by-step guide shows you how to back up and restore all your Homebrew packages, apps, and developer tools using a Brewfile - saving you hours of manual reinstalls and setup time when moving to a new machine.
image: https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1762580731/blog/migrating-your-homebrew-setup-to-a-new-mac-with-one-command/migrating-your-homebrew-setup-to-a-new-mac-with-one-command_krwbvw
keywords:
    - localStorage transactions
    - Homebrew
    - macOS
    - Brewfile
    - migrate Homebrew
    - backup Homebrew
    - restore Homebrew
    - brew bundle
    - transfer Homebrew packages
    - Mac setup automation
    - macOS developer tools
    - Homebrew export
    - Homebrew import
    - brewfile tutorial
    - brew bundle dump
    - brew bundle install
type: page
blog: post
published: 8th November 2025
readTime: 1
author: Aleksandar Trpkovski
articleTags:
    - Tech
    - Hobby
    - Other
---

# Migrating Your Homebrew Setup to a New Mac with One Command

_{{$document.published}} • {{$document.readTime}} min read — by **[{{$document.author}}](/)**_

::tag-pills{:tags="articleTags"}
::

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_850,e_sharpen:100/v1762580731/blog/migrating-your-homebrew-setup-to-a-new-mac-with-one-command/migrating-your-homebrew-setup-to-a-new-mac-with-one-command_krwbvw)

## **How to Backup and Restore Homebrew Packages on macOS**

Setting up a new Mac can be exciting - but reinstalling all your tools, libraries, and apps? Not so much. If you use Homebrew, there’s a super clean way to transfer everything from your old Mac to your new one using a single file.

In this guide, I’ll show you how to export everything installed via Homebrew, and then import it onto your new machine.

## **What Is Homebrew?**

For the uninitiated, Homebrew is the go-to package manager for macOS. Developers use it to install and manage tools like Node.js, Python, Git, Docker, and even GUI apps like Google Chrome or VSCode. You can read more <a href="https://brew.sh" target="_blank" rel="noopener noreferrer">here</a>.

## **📤 Exporting Your Homebrew Setup (Old Mac)**

Homebrew has a built-in command called brew bundle. This lets you export your entire setup into a file called Brewfile.

### **Run this on your old Mac:**

`brew bundle dump --file=~/Brewfile --describe`

- `--file=~/Brewfile` saves the list to your home directory.
- `—-describe` adds comments to explain what each package does.
- This includes:
    - brew packages (CLI tools)
    - cask apps (GUI apps like Chrome)
    - tap sources

The output of the `Brewfile` looks something like this:

```bash
# Fast, disk space efficient package manager
brew "pnpm"
# Python package management tool
brew "poetry"
# Object-relational database system
brew "postgresql@14"
# Python version management
brew "pyenv"
# Password manager that keeps all passwords secure behind one password
cask "1password"
# Universal database tool and SQL client
cask "dbeaver-community"
# Voice and text chat software
cask "discord"
# App to build and share containerised applications and microservices
cask "docker-desktop"
```

## **📥 Importing on Your New Mac**

After setting up your new Mac:

1. Install Homebrew first - <a href="https://brew.sh" target="_blank" rel="noopener noreferrer">https://brew.sh</a>
2. Transfer your `Brewfile`
   Copy your `Brewfile` to your new Mac
3. Install everything from the Brewfile:

`brew bundle --file=~/Brewfile`

Homebrew will read the file and install everything it finds - bringing your dev environment back to life in minutes.

## Conclusion

Reinstalling every package and app manually can take hours. But with the magic of brew bundle, your transition to a new machine is painless. Whether you’re upgrading your MacBook or setting up a secondary work machine, having a `Brewfile` in your backup is a huge time-saver.

So next time you run brew install, think of it as an investment in your future self.

I've put together a table with the two commands you'll need for this entire migration process.

| **Action** | **Command**                                     |
| ---------- | ----------------------------------------------- |
| Export     | `brew bundle dump --file=~/Brewfile --describe` |
| Import     | `brew bundle --file=~/Brewfile`                 |
