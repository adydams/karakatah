// type : "small" or "big"


export default function Spinner({ type }: { type: string }) {
  return <span className={`${type}`}></span>;
}
