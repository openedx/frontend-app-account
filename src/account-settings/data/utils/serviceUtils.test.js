import { handleRequestError } from '@src/account-settings/data/utils/serviceUtils';

const thrownBy = (error, unpackFunction) => {
  try {
    handleRequestError(error, unpackFunction);
  } catch (thrown) {
    return thrown;
  }
  throw new Error('handleRequestError did not throw');
};

describe('handleRequestError', () => {
  it('unpacks the field errors of a v1 body', () => {
    const error = {
      response: { data: { field_errors: { name: { developer_message: 'dev', user_message: 'Too long.' } } } },
    };
    expect(thrownBy(error).fieldErrors).toEqual({ name: 'Too long.' });
  });

  it('gives one message per property for a v2 body', () => {
    const error = {
      response: {
        data: {
          status: 400,
          detail: 'name: Too long. social_links[0].social_link: This field is required.',
          errors: {
            name: ['Too long.'],
            'social_links[0].social_link': ['This field is required.'],
            'social_links[1].platform': ['"myspace" is not a valid choice.'],
          },
        },
      },
    };
    expect(thrownBy(error).fieldErrors).toEqual({
      name: 'Too long.',
      social_links: 'This field is required. "myspace" is not a valid choice.',
    });
  });

  it('passes the packed v2 errors to a custom unpack function', () => {
    const unpack = jest.fn(() => 'unpacked');
    const error = { response: { data: { errors: { social_links: ['Enter a valid URL.'] } } } };
    expect(thrownBy(error, unpack).fieldErrors).toBe('unpacked');
    expect(unpack).toHaveBeenCalledWith({ social_links: { user_message: 'Enter a valid URL.' } });
  });

  it('rethrows an error without field errors unchanged', () => {
    const error = { response: { data: { status: 500, detail: 'A server error occurred.', errors: {} } } };
    expect(thrownBy(error)).toBe(error);
    const networkError = new Error('Network Error');
    expect(thrownBy(networkError)).toBe(networkError);
  });
});
