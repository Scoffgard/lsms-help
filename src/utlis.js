export const newDate = (val) => {
  const date = val ? new Date(val) : new Date();
  date.setSeconds(0, 0);
  return date;
}

export const toFormatedPrice = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");