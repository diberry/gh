#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { fetchPRComments } from './index.js';

async function main() {
  const [owner, repo, prNumberStr, outputPath] = process.argv.slice(2);
  if (!owner || !repo || !prNumberStr) {
    console.error('Usage: get-pr-comments <owner> <repo> <prNumber> [outputPath]');
    process.exit(1);
  }
  const prNumber = Number(prNumberStr);
  if (isNaN(prNumber)) {
    console.error('prNumber must be a number');
    process.exit(1);
  }
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Warning: No GitHub token provided. You may hit rate limits.');
  } else {
    console.log('Using GitHub token from environment variable.');
  }

  try {
    const comments = await fetchPRComments(owner, repo, prNumber, token);
    const outputFileName = outputPath ?? `${owner}_${repo}_${prNumber}.json`;
    const jsonOutput = JSON.stringify(comments, null, 2);
    writeFileSync(outputFileName, jsonOutput, 'utf-8');
    console.log(`Output saved to ${outputFileName}`);
  } catch (err) {
    console.error('Error fetching PR comments:', err);
    process.exit(2);
  }
}

main();