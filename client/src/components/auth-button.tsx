import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AuthButton() {
  const { user, isLoading, signIn, signOut } = useAuthStore();

  if (isLoading) {
    return (
      <Button disabled variant="ghost">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button onClick={signIn} className="bg-primary hover:bg-primary/90">
        <i className="fab fa-google mr-2"></i>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
            <AvatarFallback>
              {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.displayName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>
        <DropdownMenuItem>
          <i className="fas fa-heart mr-2"></i>
          My Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <i className="fas fa-sign-out-alt mr-2"></i>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
