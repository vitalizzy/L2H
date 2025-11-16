"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { User, Sun, Moon, Monitor, Globe } from "lucide-react";
import { signOut } from "@/app/actions";
import { useTheme } from "next-themes";

export function UserMenu() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <User />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuLabel>{t.navbar.myAccount}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/profile">
            {t.navbar.profile}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs">{t.language.selectLanguage}</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(value) => setLanguage(value as any)}
        >
          <DropdownMenuRadioItem value="es" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.spanish}</span>
            {language === "es" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.english}</span>
            {language === "en" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="de" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.german}</span>
            {language === "de" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="it" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.italian}</span>
            {language === "it" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.french}</span>
            {language === "fr" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pt" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.portuguese}</span>
            {language === "pt" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="hu" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.hungarian}</span>
            {language === "hu" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sv" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.swedish}</span>
            {language === "sv" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="da" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.danish}</span>
            {language === "da" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ru" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.russian}</span>
            {language === "ru" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ro" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{t.language.romanian}</span>
            {language === "ro" && <span className="ml-auto">✓</span>}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs">{t.theme.toggleTheme}</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="h-4 w-4" />
          <span>{t.theme.light}</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="h-4 w-4" />
          <span>{t.theme.dark}</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
          <Monitor className="h-4 w-4" />
          <span>{t.theme.system}</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0" asChild>
          <form action={signOut}>
            <Button
              size="sm"
              variant="destructive"
              className="rounded-sm w-full"
              type="submit"
            >
              {t.navbar.logout}
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
