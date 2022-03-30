const showAlert = (text: string) => {
  // eslint-disable-next-line no-alert
  alert(text);
};

// eslint-disable-next-line no-alert, no-restricted-globals
const showConfirm = (text: string) => confirm(text);

export {
  showAlert,
  showConfirm,
};
