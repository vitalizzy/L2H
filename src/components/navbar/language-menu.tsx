"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageMenu() {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "es", name: t.language.spanish },
    { code: "en", name: t.language.english },
    { code: "de", name: t.language.german },
    { code: "it", name: t.language.italian },
    { code: "fr", name: t.language.french },
    { code: "pt", name: t.language.portuguese },
    { code: "hu", name: t.language.hungarian },
    { code: "sv", name: t.language.swedish },
    { code: "da", name: t.language.danish },
    { code: "ru", name: t.language.russian },
    { code: "ro", name: t.language.romanian },
  ];

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        className="gap-2 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-medium">{language.toUpperCase()}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-background border rounded-lg shadow-lg z-50 min-w-48">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-xs font-semibold">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
