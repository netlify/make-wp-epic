import {urlize} from '../src/urlize';

test('urlize', () => {
  const testCases = [
    ['  foo bar  ', 'foo-bar'],
		['foo.bar/foo_bar-foo', 'foo.bar/foo_bar-foo'],
		['foo,bar:foobar', 'foobarfoobar'],
		['foo/bar.html', 'foo/bar.html'],
    // Sadly we don't handle these kind of unicode characters right at the moment
		// ['трям/трям', '%D1%82%D1%80%D1%8F%D0%BC/%D1%82%D1%80%D1%8F%D0%BC'],
		['100%-google', '100-google']
  ];

  testCases.forEach(([before, after]) => {
    expect(urlize(before)).toEqual(after);
  });
});
