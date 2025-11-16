import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserMenu } from "./user-menu";

import { createClient } from "@/utils/supabase/server";
import { Lock } from "lucide-react";

const Navbar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="w-full">
      <div className="container p-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Lock />
          <h5 className="mt-0.5">Next Level Auth</h5>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu />
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
