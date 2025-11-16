"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Menu, X, User, Sun, Moon, Monitor, Globe, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/app/actions";
import { useTheme } from "next-themes";

export function UserMenu() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

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
    <>
      {/* Hamburger Button */}
      <Button
        size="lg"
        variant="ghost"
        className="h-10 w-10 p-0 rounded-lg hover:bg-accent"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-[30%] bg-background border-l shadow-lg z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background">
          <h2 className="text-lg font-semibold">{t.navbar.myAccount}</h2>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Account
            </h3>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>{t.navbar.profile}</span>
            </Link>
          </div>

          {/* Language Section */}
          <div className="space-y-3">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="w-full flex items-center justify-between gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t.language.selectLanguage}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isLanguageOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isLanguageOpen && (
              <div className="grid grid-cols-1 gap-2 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsLanguageOpen(false);
                    }}
                    className={`text-left px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                      language === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <span className="ml-auto text-xs font-semibold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {t.theme.toggleTheme}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                className="gap-2 h-auto flex-col py-3"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">{t.theme.light}</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                className="gap-2 h-auto flex-col py-3"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">{t.theme.dark}</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                className="gap-2 h-auto flex-col py-3"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs">{t.theme.system}</span>
              </Button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="border-t pt-6">
            <form action={signOut} className="w-full">
              <Button
                variant="destructive"
                size="sm"
                className="w-full gap-2"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                {t.navbar.logout}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
