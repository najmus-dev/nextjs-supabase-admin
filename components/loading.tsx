import { Loading03Icon } from "hugeicons-react";

export default function Loading() {
    return (
      <div className="flex items-center justify-center text-center min-h-[calc(80vh-64px)]">
        <Loading03Icon className="animate-spin" />
      </div>
    );
}