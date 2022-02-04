import date from 'date-and-time';

export const monthYear = () => {
    const t = new Date();
    const p = date.compile("MMM DD/YY");
    return date.format(t, p);
}