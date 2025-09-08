import { BookOpen } from "lucide-react";

interface HeaderProps {
  universityName?: string;
}

export function Header({ universityName = "Innovate University" }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-muted-foreground" data-testid="university-logo" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" data-testid="university-name">{universityName}</h1>
              <p className="text-sm text-muted-foreground">AI Study Path Finder</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-programs">
              Programs
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-admissions">
              Admissions
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-support">
              Support
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
