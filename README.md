# Github mermaidJS SVG diagram generator

This project allows you to generate and render mermaidJS diagrams and automatically include them in github README files

## Background

I found myself in the scenario where I needed to document a software system using sequence diagrams. After discussing the matter with other engineers I consolidated the following requirements :

* Sequence diagrams need to be stored in Github next to the code which they document, to ease discoverability (not hidden in some confluence/wiki somewhere where no one will ever find them)
* Sequence diagrams need to be surfaced in Github Readme's
* Sequence diagrams need to be in SVG format to allow for render on different devices without having to generate different resolution images
* Sequence diagrams must be generated securely (the CANNOT be rendered using a 3rd party server where sensitive information about the system could potentially leak out of our network)
* Nice to have : the ability to potentially create other types of diagram in the future e.g. flow diagrams

## Tech choices

After some trial and error experimentation based on these requirements, I landed with the following tech choices :

* I will create some kind of separate sub directory for generated sequence diagrams within the codebase
* I will pre-render the SVG images and use the standard image tags in github markdown
* I will create a small local npm build process to generate the images
* I will use Mermaidjs & mermaid-cli to generate the images (not super happy about having to use Puppeter for this, seems overkill for the usecase) also gives me the option of other diagram types in the future

## Requirements

NodeJS & NPM


## Installation

In order to start modifying & rendering sequence diagrams for consumption in Github Readme's you need to first run :

```
npm install
```

## Usage

To create or modify a sequence diagram, you first need to create a folder in the src directory and create a mermaid markdown file to render.
```
mkdir src/[your sequence diagram folder]
touch src/[your sequence diagram folder]/[yourSequenceDiagramCode].mmd
```
Once this is done you can simply run :
```
node run build
```

and in the "rendered" folder you should find a subfolder with your chosen name and inside a README.md with your sequence diagram and the SVG sequence diagram itself.

## Examples
1. [githubSequenceDiagrams](generated/githubSequenceDiagrams/README.md)
1. [testFlowDiagram](generated/testFlowDiagram/README.md)
