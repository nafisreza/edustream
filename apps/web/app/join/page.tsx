export default function JoinPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join Room</h1>
          <p className="mt-2 text-muted-foreground">
            Enter a room ID to join an existing session
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium">
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="Enter room ID"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
