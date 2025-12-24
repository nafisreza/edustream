interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Room: {id}</h1>
          <button className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Leave Room
          </button>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4 text-center">
          <h2 className="text-2xl font-bold">Room Session</h2>
          <p className="text-muted-foreground">
            Room ID: <span className="font-mono font-semibold">{id}</span>
          </p>
          <div className="mt-8 rounded-lg border bg-muted p-8">
            <p className="text-muted-foreground">
              Room content will be displayed here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
