import { Link } from "react-router-dom";
import { School } from "lucide-react";

export function MainFooter() {
  return (
    <footer className="border-t border-border py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
              <School className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
            <p className="font-display font-bold text-foreground">
                Globaltech Model Academy
              </p>
              <p className="text-sm text-muted-foreground">
                Excellence in Education
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/help" className="hover:text-foreground transition-colors">
              Help
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2024 Globaltech Model Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
