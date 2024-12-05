# vscode-puzzles 🧩🧠

<h3 style="text-align: center"><i>Puzzles</i> allows you to sharpen your coding skills inside of <i>your tailored Visual Studio Code environment</i> and add <i>your own tests</i>.</h3><br />

Solve problems from Reddit's [/r/dailyprogrammer](https://reddit.com/r/dailyprogrammer/), [Project Euler](https://projecteuler.net/), [Coding Bat](https://codingbat.com/java), and [Advent of Code](https://adventofcode.com) in a fully-featured IDE, rather than a ```<textarea />``` (ugh), and write custom test cases, akin to a real job interview... which is the whole point of your practice anyway!

Use Puzzles to **prepare for technical interviews** and start **solving coding problems** like you would in actual interviews today!

<br />
<h3 style="text-align: center">See how quickly you can get coding!</h3>
<p style="text-align: center">
    <img alt="Puzzles demo" src="https://github.com/michaelfromyeg/puzzles/blob/main/puzzles.gif?raw=true" width="700px" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);" />
</p>
<br />

_Want to practice LeetCode specifically?_ Check out [this](https://marketplace.visualstudio.com/items?itemName=LeetCode.vscode-leetcode) extension instead! It should be what you're after... though Puzzles likely can help you as well!

_Like this project?_ Leave a review [here](https://marketplace.visualstudio.com/items?itemName=michaelfromyeg.vscode-puzzle) or a star on [GitHub](https://github.com/michaelfromyeg/vscode-puzzle).

## Getting Started

Here's how to build _Puzzles_ into your daily coding practice routine.

1. Download this extension!
2. Create a folder for your solutions

    ```shellscript
    # For example...
    cd ~
    mkdir puzzles
    cd puzzles
    code .
    ```

3. Hit `CTRL + SHIFT + P`, type `puzzles` and select your problem of choice
4. Get to solving!
5. (Optional) Initialize a Git repository in your new folder and publish your work to GitHub!

See this in practice (and code along with me) [here](https://github.com/michaelfromyeg/puzzles)!

## Features

As mentioned, _Puzzles_ currently supports problems from Reddit's [/r/dailyprogrammer](https://reddit.com/r/dailyprogrammer/), [Project Euler](https://projecteuler.net/), [Coding Bat](https://codingbat.com/java), and [Advent of Code](https://adventofcode.com). It fetches a user-specified or random problem for any of those three sites, creates a folder, and stores both a Markdown file with the problem description and creates a `.[py|js|ts|java|cpp]` file for you to begin your solution. For Advent of Code, it also has the ability to fetch your problem input.

An outline of planned features is below!

### Roadmap

Here's my plan for near-future development:

- [x] Support other programming language starters
- [ ] Make starters better. Include unit test templates, for example
- [ ] Support Cracking the Coding Interview problems
- [ ] Create a custom, curated list of coding problems to use for this extension

## Requirements

None required! Note that Puzzles does create folders and files though, so you'll likely want to create a separate workspace on your computer for your work.

## Extension Settings

~~In the future, there will be an option to set your preferred solving language~~. You can "Set Default Language" command.

## Known Issues

~~Currently, the extension is a bit... shaky. There is a plan to stop scraping soon and add a better data source~~. If you experience any issues at all, open an [issue](https://github.com/michaelfromyeg/vscode-puzzle/issues) or reach out via [email](mailto:michaelfromyeg@gmail.com?subject=%5BPuzzles%5D) for support!

## Release Notes

This project was originally being part at Microsoft's VS Code hackathon. It is actively under early development; if you're interested in helping grow this project, please [file a ticket](https://github.com/michaelfromyeg/vscode-puzzle/issues) or [open a pull request](https://github.com/michaelfromyeg/vscode-puzzle/pulls)!

### 1.3.0

New features:

- Advent of Code problem input support; note all session information is stored client-side via the Visual Studio Code `SecretStorage` API
- Many bug fixes and improvements

### 1.2.0

New features:

- Language support for JavaScript, TypeScript, Java, and C++
- Advent of Code support
- Fixed Project Euler support
- Upgraded to Node v22

### 1.1.0

New features:

- Documentation overhaul and renaming from `vscode-puzzle` → Puzzles
- Get a random problem from Project Euler, _or_ select a specific problem number ([#13](https://github.com/michaelfromyeg/vscode-puzzle/issues/13))

### 1.0.0

Initial release for Microsoft's VS Code Hack-a-thon, sponsored by MLH.

Supported:

- Problems from Reddit's r/dailyprogrammer, accessed via the Reddit API
- Problems from Project Euler
- Problems from Coding Bat
- The problem statement formatted into a Markdown file
- A pre-generated Python file for your solution
