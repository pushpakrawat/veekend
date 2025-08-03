import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth-button";

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-primary-foreground text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-foreground">Veekender</h1>
          </div>

          {/* Auth Section */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
