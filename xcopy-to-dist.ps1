#! /usr/bin/env bash
# this script should run in bash on nix machines and in powershell on windows

rm -r dist/*
mkdir dist
cp -r *.html *.png *.ico site.webmanifest robots.txt img css js dist/
