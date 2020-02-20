<img src="https://raw.githubusercontent.com/syscolabs/kasaya/master/docs/images/Logo-Kasaya-v5-with-text.png" width="250px" />

# Kasaya (beta)

### A "WYSIWYG" scripting language and runtime for browser automation

* Write test scripts using English-like statements.
* NO coding required to implement those statements.
* Not dependent on HTML IDs or XPaths.
* Write the **same way you would instruct another human being** sitting in front of the browser.
* NOT like Cucumber.
* NOT like Selenium IDE.
* You can:
  * Do your initial dev test in REPL mode.
  * Save the statements as a script.
  * Share with QA to expand the scenarios.
  * Even share with the product manager.

### What You See Is What You Write:

---

<img src="https://raw.githubusercontent.com/syscolabs/kasaya/master/docs/images/cat-age.gif" 
  width="750px" 
  style="border-style:solid"
/>

---

# Table of Contents

- [Installation](#installation)
- [Getting started](#getting-started)
- [Grammar](#grammar)
- [Command reference](#command-reference)
- [VS Code Extension](#vs-code-extension)
- [FAQ](#faq)

# Installation

First, you need:

1. Java JDK ([download](https://www.oracle.com/java/technologies/javase-jdk13-downloads.html))
2. Google Chrome version 66 or higher ([download](https://www.google.com/chrome/))
3. Node.js version 12 or higher ([download](https://nodejs.org/en/download/))

Run on a terminal window (on Linux, you may need `sudo`)

```
$ npm install -g kasaya
```

(*Installation might take a few minutes*)

# Getting started

### Interactive mode

```
$ kasaya
Kasāya> open "google.com"
Kasāya> type "cat"
Kasāya> press enter
Kasāya> read "Lifespan: ${min} – ${max} years" near "Family"
Kasāya> check if $max is "20"
```

### Script mode

```
$ vi cat.kasaya
~~~~
  start
    # verify that the maximum lifespan of a cat according to google is 20 years
    open "google.com"
    type "cat"
    press enter
    read "Lifespan: ${min} – ${max} years" near "Family"
    check if $max is "20"
 end
~~~
:wq
$ kasaya cat.kasaya
```

# Grammar

*TODO: Improve this section*

Kasaya's grammar is based on [JARVIS](https://github.com/hliyan/jarvis), which is a rudimentary natural lanugage tool based on pattern matching. Targeted for test automation, it currently lacks certain basic programming language features such as conditionals and loops.

### Phrases

Kasaya's statements are made up of _phrases_ rather than keywords and functions. Phrases can either be built in, or macro-based. Arguments can be placed anywhere within the phrase. 

### Blocks

Kasaya supports the following block level structures:

* `in this context` - declare constants and imports for the file context
* `how to <macro phrase>` - declares a macro
* `start <run block>` - statements within run blocks will be executed immediately

### Variables

* Extract a value within a pattern into a variable: `"Hello ${name}"`
* Variable access within a phrase: `$name`
* Variable assignment: `set $name to "Something else"`

### Constants

* Constant declaration within context block: `NAME is "World"`

# Command reference

Here are some examples of the most commonly used commands:

```
open "foo.com"
click "Sign In"
click "Username"
type "johnsmith@gmail.com"
press tab
type "12345"
click "Confirm"
read "You are logged in as ${username}" near "Success"
check if $username is "johnsmith@google.com"
read ${sender} from row "Test email" column "Sender"
print $sender
```
*TODO: Improve this section*

[More commands](https://github.com/syscolabs/kasaya/blob/master/docs/command-summary.md)

# VS Code Extension

Get Visual Studio Code extension for Kasāya scripting from [here](https://github.com/syscolabs/kasaya-vsix)
 
# FAQ

## Where does the name "Kasaya" come from?

We noticed that many a test tool is named after brewed drinks ("Mocha", "Chai", "Espresso"). "Kasaya" (pronounced Kuh-SAA-yuh) is also a brewed drink -- it is an Ayurvedic medicinal drink popular is Sri Lanka (better known in India as https://en.wikipedia.org/wiki/Kashayam).

## What's different about Kasaya?

The idea behind Kasaya is that, if we're able to verbally instruct a human being to run a UI test without referring to DOM elements, XPATHs or HTML IDs, it should be able to do the same with a machine. Unlike in some natural language test automation tools, you don't have to write any functions to help resolve statements to HTML IDs or XPATHs. Kasaya works out-of-the-box.

## Is it based on machine learning?

No. It's based on clever but simple heuristics that attempt to mimic how human beings look at a screen and identify visual elements.

## Who developed this?

Kasaya was envisioned and developed entirely by the folks at Sysco LABS, Sri Lanka.

## What is the current status of Kasaya?

As of this writing (Jan 2020), Kasaya is in public beta, which means while all the basics work, there's a lot to be ironed out before we can get to version 1.0. 

## Can I contribute?

Eventually, yes! For now, please be patient with us -- we don't yet have a dedicated developer who can work with the community. But we're trying to get there, stay tuned!

But if you find bugs, or have great ideas, let us know!

## I found a bug.

Great! Please report it on our issue tracker, with reproduction steps: https://github.com/syscolabs/kasaya/issues
