import { cn } from "~/lib/service/utils";

export function Toast({ title }: { title: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg",
      )}
    >
      {title}
    </div>
  );
}
