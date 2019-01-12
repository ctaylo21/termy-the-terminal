# Contributing to JumpStart

Want to contribute? Great! Here's a quick guide to get started.

## Git Commits
This project uses [commitzen](https://github.com/commitizen/cz-cli) to ensure a consistent git commit message standard. 
When you are ready to commit code, use the command:

```
npm run cm
```

Now just follow the prompts commit your code. The description of the change should follow these standards:

  - use the imperative, present tense: "change" not "changed" nor "changes"
  - don't capitalize the first letter
  - no dot (.) at the end

**Important:** If your commit fails (i.e. from a `pre-commit` hook), you can re-commit without having to re-enter all of your
previous choices by running:

```
npm run cm -- --retry
```

## Submitting a Pull Request

Please use the [Github Flow](https://guides.github.com/introduction/flow/index.html) for any code changes. The typical process will be the following:

1. Fork the repo and create your branch from master
2. Any changes that can be documented, should be documented
3. All `npm` commands should still correctly function
4. Code should lint properly via `npm run lint`
5. Create the pull request!

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## Reporting Issues

If you have an issue, please [open a new issue](https://github.com/ctaylo21/JumpStart/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Code Standards

All code written should conform to [eslint](https://eslint.org/). No errors should be present after running `npm run lint`. All commited `*.js` files
are automatically linted on commits to ensure they adhere to project standards.

