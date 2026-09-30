import { Link } from "react-router-dom";
import { QueryLabLogo } from "@/components/common/QueryLabLogo";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface p-6 text-center">
      <QueryLabLogo className="h-12 w-12" />
      <h1 className="text-headline-lg">Page not found</h1>
      <p className="text-body-md text-on-surface-variant">Return to QueryLab Dashboard</p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
