"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  FlaskConical,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setSession(data);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <FlaskConical className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">PeptideFind</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/search">Search</NavLink>
            <NavLink href="/vendors">Vendors</NavLink>
            <NavLink href="/compare">Compare</NavLink>
            <NavLink href="/guides">Guides</NavLink>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="mx-4 hidden w-full max-w-sm lg:block xl:max-w-md">
          <SearchBar size="default" />
        </div>

        {/* Right: Auth */}
        <div className="hidden items-center gap-2 md:flex">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[120px] truncate">
                  {session.user.name || session.user.email?.split("@")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white py-2 shadow-lg">
                    <div className="border-b px-4 py-2">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                      {session.user.role === "ADMIN" && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        window.location.href = "/api/auth/signout";
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-1.5 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white p-4 md:hidden">
          <SearchBar className="mb-4" />
          <nav className="flex flex-col gap-1">
            <MobileNavLink
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </MobileNavLink>
            <MobileNavLink
              href="/vendors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vendors
            </MobileNavLink>
            <MobileNavLink
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </MobileNavLink>
            <MobileNavLink
              href="/guides"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides
            </MobileNavLink>

            {session?.user ? (
              <>
                <MobileNavLink
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                {session.user.role === "ADMIN" && (
                  <MobileNavLink
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </MobileNavLink>
                )}
                <div className="mt-2 border-t pt-2">
                  <div className="mb-2 flex items-center gap-2 px-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-red-600"
                    onClick={() => {
                      window.location.href = "/api/auth/signout";
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-2 border-t pt-3">
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
