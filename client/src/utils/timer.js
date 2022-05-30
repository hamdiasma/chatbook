export const timer = (hours, mins, seconds) => {
  return (
    <>
      <span>{hours.toString().length < 2 ? "0" + hours : hours}</span>
      <span>:</span>
      <span>{mins.toString().length < 2 ? "0" + mins : mins}</span>
      <span>:</span>
      <span> {seconds.toString().length < 2 ? "0" + seconds : seconds}</span>
    </>
  );
};
