import help from '../help';
const { autoCompleteHandler } = help;

describe('help suite', (): void => {
  // Due to annoying mocking issues with React Context, we test the
  // handler that renders the help component with integration tests
  // and only test autocomplete here
  it('autocomplete should do nothing', async (): Promise<void> => {
    const result = await autoCompleteHandler({}, '/home', '');

    expect(result).toStrictEqual({ commandResult: null });
  });
});
