import { help, helpAutoComplete } from '../help';
import { render } from '@testing-library/react';
import services from '..';

describe('help suite', (): void => {
  it('should contain help descriptions for each service', async (): Promise<
    void
  > => {
    const helpResult = await help();
    const { container } = render(helpResult.commandResult as JSX.Element);

    Object.keys(services).forEach((service): void => {
      if (service.indexOf('AutoComplete') === -1) {
        expect(container.innerHTML).toContain(service);
      }
    });
  });

  it('autocomplete should do nothing', async (): Promise<void> => {
    const result = await helpAutoComplete({}, '/home', '');

    expect(result).toStrictEqual({ commandResult: null });
  });
});
