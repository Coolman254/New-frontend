import { School, GraduationCap, UserCheck, Users, Shield } from "lucide-react";

export function LoginBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

      <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent shadow-glow">
            <School className="h-8 w-8 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Globaltech Model</h1>
            <p className="text-lg opacity-80">Academy</p>
          </div>
        </div>

        <h2 className="font-display text-4xl font-bold mb-4 leading-tight">
          Empowering Education<br />
          <span className="text-gradient">Through Technology</span>
        </h2>

        <p className="text-lg opacity-80 mb-8 max-w-md">
          Access learning materials, track progress, and stay connected with our
          comprehensive e-learning platform.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          {[
            { icon: GraduationCap, label: "1,245+", sublabel: "Students" },
            { icon: UserCheck, label: "48", sublabel: "Teachers" },
            { icon: Users, label: "890+", sublabel: "Parents" },
            { icon: Shield, label: "24/7", sublabel: "Support" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm"
            >
              <stat.icon className="h-8 w-8 text-accent" />
              <div>
                <p className="font-display font-bold text-xl">{stat.label}</p>
                <p className="text-sm opacity-70">{stat.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/10" />
      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-accent/5" />
    </div>
  );
}
