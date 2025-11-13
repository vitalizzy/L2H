"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import RegisterForm from "./_components/register-form";

export const dynamic = "force-dynamic";

const RegisterPage = () => {
  const { t } = useLanguage();

  return (
    <section className="container flex h-screen flex-col items-center justify-center">
      <Button variant="outline" asChild>
        <Link href="/" className={cn("absolute left-4 top-4")}>
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          {t.register.back}
        </Link>
      </Button>

      <div className="mx-auto max-w-80 flex flex-col justify-center space-y-6 ">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.register.title}
          </h1>

          <p className="text-sm text-muted-foreground">
            {t.register.description}
          </p>
        </div>

        <RegisterForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            {t.register.haveAccount} {t.register.login}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
