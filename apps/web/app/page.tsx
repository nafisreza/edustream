import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">EduStream</h1>
          <nav className="flex gap-4">
            <Link
              href="/join"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Join
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Create
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to EduStream
            </h1>
            <p className="text-lg text-muted-foreground">
              Educational streaming platform for interactive learning sessions
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/create"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Room
            </Link>
            <Link
              href="/join"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Join Room
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
