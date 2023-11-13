export default function VideoArea() {
  // call api
  return (
    <div className="w-1/2 bg-blue-400 h-fit flex flex-col">
      <div className="h-[calc(50vw*9/16)] bg-blue-200">I am video area</div>
      <div className="h-[150px] bg-blue-100">I am chart area</div>
    </div>
  );
}
