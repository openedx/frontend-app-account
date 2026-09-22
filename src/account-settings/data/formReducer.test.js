import {
  BEGIN_NAME_CHANGE,
  CLOSE_FORM,
  formReducer,
  initialFormState,
  OPEN_FORM,
  RESET_DRAFTS,
  SAVE_BEGIN,
  SAVE_FAILURE,
  SAVE_PREVIOUS_SITE_LANGUAGE,
  SAVE_RESET,
  SAVE_SUCCESS,
  UPDATE_DRAFT,
} from './formReducer';

const reduce = (actions, state = initialFormState) => actions.reduce(formReducer, state);

describe('formReducer', () => {
  it('returns the initial state for unknown actions', () => {
    expect(formReducer(undefined, { type: 'NOPE' })).toEqual(initialFormState);
  });

  it('opens a form and clears leftovers from the previous one', () => {
    const state = reduce([
      { type: UPDATE_DRAFT, name: 'name', value: 'x' },
      { type: SAVE_FAILURE, errors: { name: 'bad' } },
      { type: OPEN_FORM, formId: 'email' },
    ]);

    expect(state).toEqual({
      ...initialFormState, openFormId: 'email', drafts: {}, errors: {}, saveState: null,
    });
  });

  it('only lets the open form close itself', () => {
    const open = reduce([
      { type: OPEN_FORM, formId: 'email' },
      { type: UPDATE_DRAFT, name: 'email', value: 'a@b.c' },
      { type: BEGIN_NAME_CHANGE, formId: 'name' },
    ]);

    expect(formReducer(open, { type: CLOSE_FORM, formId: 'name' })).toBe(open);
    expect(formReducer(open, { type: CLOSE_FORM, formId: 'email' })).toEqual({
      ...open,
      openFormId: null,
      saveState: null,
      errors: {},
      drafts: {},
      nameChangeModal: false,
    });
  });

  it('records drafts and resets the save outcome while typing', () => {
    const state = reduce([
      { type: SAVE_FAILURE, errors: { name: 'bad' } },
      { type: UPDATE_DRAFT, name: 'name', value: 'Jane' },
      { type: UPDATE_DRAFT, name: 'email', value: 'j@e.com' },
    ]);

    expect(state.drafts).toEqual({ name: 'Jane', email: 'j@e.com' });
    expect(state.saveState).toBeNull();
    expect(state.errors).toEqual({});
    expect(formReducer(state, { type: RESET_DRAFTS }).drafts).toEqual({});
  });

  it('opens the name change modal as a failed save', () => {
    expect(formReducer(initialFormState, { type: BEGIN_NAME_CHANGE, formId: 'name' })).toEqual({
      ...initialFormState,
      saveState: 'error',
      nameChangeModal: { formId: 'name' },
    });
  });

  it('tracks a save from pending to complete, accumulating confirmations', () => {
    const pending = formReducer(initialFormState, { type: SAVE_BEGIN });
    expect(pending.saveState).toBe('pending');

    const complete = reduce([
      { type: SAVE_SUCCESS, confirmationValues: { email: 'new@example.com' } },
      { type: SAVE_SUCCESS, confirmationValues: { secondary_email: 'other@example.com' } },
    ], pending);
    expect(complete.saveState).toBe('complete');
    expect(complete.confirmationValues).toEqual({
      email: 'new@example.com',
      secondary_email: 'other@example.com',
    });
  });

  it('tracks a failed save with its field errors', () => {
    const failed = formReducer(initialFormState, { type: SAVE_FAILURE, errors: { email: 'Invalid' } });
    expect(failed).toEqual({ ...initialFormState, saveState: 'error', errors: { email: 'Invalid' } });

    const failedWithoutFields = formReducer(initialFormState, { type: SAVE_FAILURE });
    expect(failedWithoutFields).toEqual({ ...initialFormState, saveState: 'error' });
  });

  it('resets the save outcome', () => {
    const state = reduce([
      { type: SAVE_FAILURE, errors: { email: 'Invalid' } },
      { type: SAVE_RESET },
    ]);
    expect(state).toEqual(initialFormState);
  });

  it('remembers the previous site language', () => {
    expect(formReducer(initialFormState, { type: SAVE_PREVIOUS_SITE_LANGUAGE, previousSiteLanguage: 'en' }))
      .toEqual({ ...initialFormState, previousSiteLanguage: 'en' });
  });
});
