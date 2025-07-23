import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-2xl font-bold">Site Builder</h1>
          <nav className="ml-auto flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 py-20 md:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">Build Your Website</h1>
            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              Create custom web pages with HTML, CSS, and JavaScript in our intuitive editor. Preview your changes in
              real-time.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Site Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
