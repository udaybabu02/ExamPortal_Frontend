import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import armsLogo from "@/assets/arms-logo.png";
import { useToast } from "@/hooks/use-toast";

// --- IMPORT ADDED HERE ---
import { API_BASE_URL } from "@/config";

/** Generate a unique Hall Ticket Number like ARMS-XXXXXX */
function generateHallTicket(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "ARMS-";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const passwordChecks = [
  { label: "8–16 characters", test: (p: string) => p.length >= 8 && p.length <= 16 },
  { label: "Contains a letter", test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains a special character", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [idType, setIdType] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const hallTicket = useState(() => generateHallTicket())[0];

  const emailValid = /^[^\s@]+@gmail\.com$/i.test(email.trim());
  const mobileValid = /^[6-9]\d{9}$/.test(mobile.trim());
  const allPasswordChecksPass = passwordChecks.every((c) => c.test(password));

  const validate = (): string | null => {
    if (!name.trim()) return "Full name is required.";
    if (!email.trim() || !emailValid) return "Enter a valid Gmail address (e.g. user@gmail.com).";
    if (!mobile.trim() || !mobileValid) return "Enter a valid 10-digit Indian mobile number.";
    if (!allPasswordChecksPass) return "Password does not meet all requirements.";
    
    if (!idType) return "Select an ID type.";
    if (idType === "college" && !collegeId.trim()) return "Enter your College ID.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast({ variant: "destructive", title: "Validation Error", description: err });
      return;
    }

    setLoading(true);

    try {
      // --- LOCALHOST REMOVED, API_BASE_URL ADDED HERE ---
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
          password,
          idType,
          userId: idType === "college" ? collegeId.trim() : hallTicket,
          hallTicket,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ variant: "destructive", title: "Registration Failed", description: data.message });
        setLoading(false);
        return;
      }

      toast({ title: "Registration successful!", description: `Your Hall Ticket: ${hallTicket}` });
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 600);

    } catch (error) {
      console.error("Fetch error:", error);
      toast({ variant: "destructive", title: "Network Error", description: "Could not connect to the server. Is it running?" });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 text-center">
          <img src={armsLogo} alt="ARMS Logo" className="max-h-[90px] w-auto object-contain drop-shadow-lg p-2" />
          <p className="text-muted-foreground text-sm">Create your account</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription>Fill in all fields to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email (Gmail only) *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {email && !emailValid && <p className="text-xs text-destructive">Must be a valid @gmail.com address</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <Label htmlFor="mobile">Mobile Number (India) *</Label>
                <div className="flex gap-2">
                  <span className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                {mobile && !mobileValid && <p className="text-xs text-destructive">Enter a valid 10-digit number starting with 6-9</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Password *</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={16}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <ul className="mt-1.5 space-y-0.5">
                    {passwordChecks.map((c) => {
                      const pass = c.test(password);
                      return (
                        <li key={c.label} className={`flex items-center gap-1.5 text-xs ${pass ? "text-green-600" : "text-destructive"}`}>
                          {pass ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {c.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* ID Type */}
              <div className="space-y-1.5">
                <Label>ID Type *</Label>
                <Select value={idType} onValueChange={setIdType}>
                  <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="college">College ID (enter manually)</SelectItem>
                    <SelectItem value="hallticket">Use Hall Ticket ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {idType === "college" && (
                <div className="space-y-1.5">
                  <Label htmlFor="college-id">College ID *</Label>
                  <Input id="college-id" placeholder="e.g. COL-12345" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} required />
                </div>
              )}

              {idType === "hallticket" && (
                <div className="space-y-1.5">
                  <Label>Your Hall Ticket Number</Label>
                  <Input value={hallTicket} readOnly className="bg-muted font-mono tracking-wider" />
                  <p className="text-xs text-muted-foreground">Auto-generated. Save this for login reference.</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
