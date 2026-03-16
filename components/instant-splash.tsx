"use client";

export function InstantSplash() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-4 animate-in fade-in duration-300">
        {/* Logo */}
        <div className="relative mx-auto">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
            <span className="text-4xl font-bold text-primary-foreground">C</span>
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#FFD700] border-4 border-background flex items-center justify-center">
            <span className="text-xs font-bold">π</span>
          </div>
        </div>

        {/* App Name */}
        <div>
          <h1 className="text-3xl font-bold text-primary">CasaLoop</h1>
          <p className="text-sm text-muted-foreground mt-1">Real Estate on Pi Network</p>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
}
