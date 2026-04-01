@echo off
cd /d "%~dp0.."
bun ./src/entrypoints/cli.tsx %*
