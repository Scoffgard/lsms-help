export const newDate = (val) => {
  const date = val ? new Date(val) : new Date();
  date.setSeconds(0, 0);
  return date;
}

export const toFormatedPrice = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const showId = () => {
  if (window.localStorage.getItem('lsms-force-id') == 'true') return window.localStorage.getItem('lsms-id');
  return ''
}