export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full border border-black/10 border-t-black animate-spin" style={{ animationDuration: "1.5s" }} />
    </div>
  );
}
