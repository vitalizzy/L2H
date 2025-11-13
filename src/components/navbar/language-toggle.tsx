"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 h-9">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t.language.selectLanguage}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={5}>
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(value) => setLanguage(value as any)}
        >
          <DropdownMenuRadioItem value="es">
            {t.language.spanish}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">
            {t.language.english}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="de">
            {t.language.german}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sv">
            {t.language.swedish}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="da">
            {t.language.danish}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr">
            {t.language.french}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ru">
            {t.language.russian}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="hu">
            {t.language.hungarian}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pt">
            {t.language.portuguese}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="it">
            {t.language.italian}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ro">
            {t.language.romanian}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
