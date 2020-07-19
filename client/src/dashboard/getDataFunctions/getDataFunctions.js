const requestSOs = async (setLoadedSOs, sendRequest) => {
  try {
    const responseData = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + '/so'
    );

    setLoadedSOs(responseData);
  } catch (err) {
    console.log('Could not fetch SOs');
  }
};

const requestMHMs = async (setLoadedMHMs, sendRequest) => {
  try {
    const responseData = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + '/mhm'
    );

    setLoadedMHMs(responseData);
  } catch (err) {
    console.log('Could not fetch MHMs', err);
  }
};

const requestJobs = async (setLoadedJobs, sendRequest) => {
  try {
    const responseData = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + '/jobs'
    );

    setLoadedJobs(responseData);
  } catch (err) {
    console.log('Could not fetch Jobs');
  }
};

const requestDashboardData = async (
  setLoadedSOs,
  setLoadedMHMs,
  setLoadedJobs,
  sendRequest
) => {
  try {
    await requestSOs(setLoadedSOs, sendRequest);
    await requestMHMs(setLoadedMHMs, sendRequest);
    await requestJobs(setLoadedJobs, sendRequest);
  } catch (err) {
    console.log('[requestDashboardData], An error occured', err);
  }
};

export default requestDashboardData;
