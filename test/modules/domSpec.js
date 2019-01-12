describe('module/dom', () => {
  let testDiv;

  beforeEach(() => {
    testDiv = document.createElement('div');
    testDiv.id = 'domSpec-testDiv';
    document.body.appendChild(testDiv);
  });

  afterEach(() => {
    testDiv.parentNode.removeChild(testDiv);
  });

  it('should update innerHTML of test div', () => {
    testDiv.innerHTML = 'hello';
    assert.strictEqual(document.getElementById('domSpec-testDiv').innerHTML, 'hello');
  });
});
