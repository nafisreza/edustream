export default function CreatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Room</h1>
          <p className="mt-2 text-muted-foreground">
            Start a new educational streaming session
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium">
              Room Name
            </label>
            <input
              id="roomName"
              type="text"
              placeholder="Enter room name"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Enter room description"
              rows={4}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

