import PropTypes from 'prop-types';

const PageLoading = ({ srMessage }) => {
  const renderSrMessage = () => {
    if (!srMessage) {
      return null;
    }

    return (
      <span className="sr-only">
        {srMessage}
      </span>
    );
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          height: '50vh',
        }}
      >
        <div className="spinner-border text-primary" role="status">
          {renderSrMessage()}
        </div>
      </div>
    </div>
  );
};

PageLoading.propTypes = {
  srMessage: PropTypes.string.isRequired,
};

export default PageLoading;
