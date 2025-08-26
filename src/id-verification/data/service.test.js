import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import qs from 'qs';
import { getExistingIdVerification, getEnrollments, submitIdVerification } from './service';

jest.mock('@edx/frontend-platform', () => {
  const actual = jest.requireActual('@edx/frontend-platform');
  return {
    ...actual,
    getConfig: jest.fn(),
  };
});

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('qs');

describe('ID Verification Service', () => {
  let mockHttpClient;

  beforeEach(() => {
    jest.resetAllMocks();

    getConfig.mockReturnValue({ LMS_BASE_URL: 'http://test.lms' });

    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };

    getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
  });

  describe('getExistingIdVerification', () => {
    it('returns transformed data on success', async () => {
      const mockResponse = {
        data: { status: 'approved', expires: '2025-12-01', can_verify: true },
      };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getExistingIdVerification();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://test.lms/verify_student/status/',
        { headers: { Accept: 'application/json' } },
      );
      expect(result).toEqual({
        status: 'approved',
        expires: '2025-12-01',
        canVerify: true,
      });
    });

    it('returns defaults on failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network error'));

      const result = await getExistingIdVerification();

      expect(result).toEqual({
        status: null,
        expires: null,
        canVerify: false,
      });
    });
  });

  describe('getEnrollments', () => {
    it('returns data on success', async () => {
      const mockResponse = { data: [{ course_id: 'course-v1:test+T101+2025', mode: 'verified' }] };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await getEnrollments();

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://test.lms/api/enrollment/v1/enrollment',
        { headers: { Accept: 'application/json' } },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('returns empty object on failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Server error'));

      const result = await getEnrollments();

      expect(result).toEqual({});
    });
  });

  describe('submitIdVerification', () => {
    it('posts transformed data and returns success', async () => {
      const verificationData = {
        facePhotoFile: 'face-img',
        idPhotoFile: 'id-img',
        idPhotoName: 'John Doe',
        courseRunKey: 'course-v1:test+T101+2025',
      };
      const expectedPostData = {
        face_image: 'face-img',
        photo_id_image: 'id-img',
        full_name: 'John Doe',
      };
      qs.stringify.mockReturnValue('encoded-data');
      mockHttpClient.post.mockResolvedValue({});

      const result = await submitIdVerification(verificationData);

      expect(qs.stringify).toHaveBeenCalledWith(expectedPostData);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'http://test.lms/verify_student/submit-photos/',
        'encoded-data',
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      expect(result).toEqual({ success: true, message: null });
    });

    it('omits null/undefined values', async () => {
      const verificationData = {
        facePhotoFile: 'face-img',
        idPhotoFile: null,
        idPhotoName: undefined,
      };
      qs.stringify.mockReturnValue('encoded-data');
      mockHttpClient.post.mockResolvedValue({});

      await submitIdVerification(verificationData);

      expect(qs.stringify).toHaveBeenCalledWith({ face_image: 'face-img' });
    });

    it('returns failure object on error', async () => {
      const error = new Error('Failed');
      error.customAttributes = { httpErrorStatus: 400 };
      mockHttpClient.post.mockRejectedValue(error);

      const result = await submitIdVerification({ facePhotoFile: 'face-img' });

      expect(result).toEqual({
        success: false,
        status: 400,
        message: expect.stringContaining('Failed'),
      });
    });
  });
});
