export default function (val: string) {
  const number = parseInt(val);
  if (isNaN(number)) return undefined;
  return number;
}
